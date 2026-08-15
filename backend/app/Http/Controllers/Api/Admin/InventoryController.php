<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InventoryController extends Controller
{
    /**
     * Get inventory list with stock status rules and summary statistics.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category:id,name_uz,name_ru');

        // Filter by stock status rule
        if ($request->filled('stock_status')) {
            $stockStatus = $request->stock_status;
            if ($stockStatus === 'out_of_stock') {
                $query->where('stock', 0);
            } elseif ($stockStatus === 'low_stock') {
                $query->where('stock', '>', 0)->where('stock', '<=', 10);
            } elseif ($stockStatus === 'normal') {
                $query->where('stock', '>', 10);
            }
        }

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        // Summary metrics
        $totalItems = Product::sum('stock');
        $normalCount = Product::where('stock', '>', 10)->count();
        $lowStockCount = Product::where('stock', '>', 0)->where('stock', '<=', 10)->count();
        $outOfStockCount = Product::where('stock', 0)->count();

        $products = $query->orderBy('stock', 'asc')->paginate(20);

        return response()->json([
            'status' => 'success',
            'summary' => [
                'total_units' => $totalItems,
                'normal_count' => $normalCount,
                'low_stock_count' => $lowStockCount,
                'out_of_stock_count' => $outOfStockCount,
            ],
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
     * Update a product's stock directly.
     */
    public function updateStock(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'stock' => ['required', 'integer', 'min:0', 'max:999999'],
        ]);

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mahsulot topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        $product->stock = (int) $request->stock;
        $product->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Ombor qoldig‘i muvaffaqiyatli yangilandi.',
            'data' => $product,
        ], Response::HTTP_OK);
    }
}
