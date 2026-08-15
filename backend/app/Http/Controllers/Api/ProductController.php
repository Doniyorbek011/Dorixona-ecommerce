<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    /**
     * Display a paginated listing of products with flexible filters and sorting.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category')->where('status', true);

        // 1. Category filter (by ID or Slug)
        if ($request->filled('category')) {
            $categoryVal = $request->input('category');
            $query->whereHas('category', function ($q) use ($categoryVal) {
                $q->where('id', $categoryVal)
                  ->orWhere('slug', $categoryVal);
            });
        }

        // 2. Search query (name, brand, description)
        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 3. Brand filter (single or comma-separated/array)
        if ($request->filled('brand')) {
            $brands = is_array($request->input('brand'))
                ? $request->input('brand')
                : explode(',', $request->input('brand'));
            $brands = array_filter(array_map('trim', $brands));
            if (!empty($brands)) {
                $query->whereIn('brand', $brands);
            }
        }

        // 4. Price range filter (based on effective price)
        if ($request->filled('price_min')) {
            $min = (float) $request->input('price_min');
            $query->where(function ($q) use ($min) {
                $q->where(function ($sub) use ($min) {
                    $sub->whereNotNull('discount_price')
                        ->where('discount_price', '>=', $min);
                })->orWhere(function ($sub) use ($min) {
                    $sub->whereNull('discount_price')
                        ->where('price', '>=', $min);
                });
            });
        }

        if ($request->filled('price_max')) {
            $max = (float) $request->input('price_max');
            $query->where(function ($q) use ($max) {
                $q->where(function ($sub) use ($max) {
                    $sub->whereNotNull('discount_price')
                        ->where('discount_price', '<=', $max);
                })->orWhere(function ($sub) use ($max) {
                    $sub->whereNull('discount_price')
                        ->where('price', '<=', $max);
                });
            });
        }

        // 5. In-stock availability filter
        if ($request->boolean('in_stock')) {
            $query->where('stock', '>', 0);
        }

        // 6. Discounted only filter
        if ($request->boolean('has_discount')) {
            $query->whereNotNull('discount_price')
                  ->where('discount_price', '>', 0);
        }

        // 7. Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderByRaw('COALESCE(discount_price, price) ASC');
                break;
            case 'price_desc':
                $query->orderByRaw('COALESCE(discount_price, price) DESC');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'popular':
                $query->orderBy('stock', 'desc')->orderBy('id', 'asc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        // 8. Pagination
        $perPage = (int) $request->input('per_page', 12);
        $perPage = min(max($perPage, 1), 50);

        $products = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Admin: List all products with all statuses.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Product::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $perPage = (int) $request->input('per_page', 15);
        $products = $query->latest()->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Lightweight search/autocomplete for instant suggestion dropdowns.
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $search = trim($request->input('q', ''));

        if (empty($search) || strlen($search) < 2) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ], Response::HTTP_OK);
        }

        $results = Product::with('category:id,name_uz,name_ru,slug')
            ->where('status', true)
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            })
            ->select(['id', 'category_id', 'name', 'slug', 'price', 'discount_price', 'brand', 'stock', 'image'])
            ->take(8)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $results,
        ], Response::HTTP_OK);
    }

    /**
     * Return list of distinct brands with product counts.
     */
    public function brands(): JsonResponse
    {
        $brands = Product::where('status', true)
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->select('brand', DB::raw('count(*) as count'))
            ->groupBy('brand')
            ->orderBy('brand', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $brands,
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified product along with similar products.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $product = Product::with('category')
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->first();

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mahsulot topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        // Fetch similar products in same category
        $similarProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', true)
            ->take(4)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $product,
            'similar_products' => $similarProducts,
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created product in storage (Admin only).
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . rand(1000, 9999);
        }

        // Handle uploaded image file if present
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $data['image'] = url('/storage/' . $path);
        }

        $product = Product::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Mahsulot muvaffaqiyatli qo‘shildi.',
            'data' => $product->load('category'),
        ], Response::HTTP_CREATED);
    }

    /**
     * Update the specified product in storage (Admin only).
     */
    public function update(UpdateProductRequest $request, int|string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mahsulot topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        $data = $request->validated();
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . $product->id;
        }

        // Handle uploaded image file if present
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $data['image'] = url('/storage/' . $path);
        }

        $product->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Mahsulot ma’lumotlari yangilandi.',
            'data' => $product->load('category'),
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified product from storage (Admin only).
     */
    public function destroy(int|string $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mahsulot topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Mahsulot o‘chirildi.',
        ], Response::HTTP_OK);
    }
}
