<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    /**
     * Get all active categories with product counts.
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::withCount(['products' => function ($query) {
            $query->where('status', true);
        }])
        ->when(!$request->user() || $request->user()->role !== 'admin', function ($query) {
            $query->where('status', true);
        })
        ->orderBy('name_uz', 'asc')
        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ], Response::HTTP_OK);
    }

    /**
     * Get a specific category by ID or slug with active products.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $category = Category::where('slug', $idOrSlug)
            ->orWhere('id', is_numeric($idOrSlug) ? (int) $idOrSlug : 0)
            ->with(['products' => function ($query) {
                $query->where('status', true)->latest();
            }])
            ->first();

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategoriya topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'status' => 'success',
            'data' => $category,
        ], Response::HTTP_OK);
    }

    /**
     * Admin: Store a new category.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name_uz']);
        }
        $data['status'] = $request->boolean('status', true);

        $category = Category::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategoriya muvaffaqiyatli yaratildi.',
            'data' => $category,
        ], Response::HTTP_CREATED);
    }

    /**
     * Admin: Update an existing category.
     */
    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategoriya topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        $data = $request->validated();
        if (isset($data['name_uz']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name_uz']);
        }

        $category->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategoriya muvaffaqiyatli yangilandi.',
            'data' => $category,
        ], Response::HTTP_OK);
    }

    /**
     * Admin: Delete a category.
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::withCount('products')->find($id);

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategoriya topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($category->products_count > 0) {
            return response()->json([
                'status' => 'error',
                'message' => "Ushbu kategoriyaga biriktirilgan {$category->products_count} ta mahsulot mavjud. O‘chirishdan oldin ularni boshqa kategoriyaga o‘tkazing.",
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategoriya o‘chirildi.',
        ], Response::HTTP_OK);
    }
}
