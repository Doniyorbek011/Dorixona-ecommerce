<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of active categories with products count.
     */
    public function index(Request $request): JsonResponse
    {
        $categories = Category::where('status', true)
            ->withCount(['products' => function ($query) {
                $query->where('status', true);
            }])
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified category with related products.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $category = Category::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->where('status', true)
            ->withCount(['products' => function ($query) {
                $query->where('status', true);
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
}
