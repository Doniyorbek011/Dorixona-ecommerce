<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerController extends Controller
{
    /**
     * List all customers with their order aggregates.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::withCount('orders')
            ->withSum(['orders' => function ($q) {
                $q->where('status', '!=', 'cancelled');
            }], 'total')
            ->where('role', 'user');

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $customers->items(),
            'pagination' => [
                'total' => $customers->total(),
                'per_page' => $customers->perPage(),
                'current_page' => $customers->currentPage(),
                'last_page' => $customers->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Show single customer profile with orders.
     */
    public function show(int $id): JsonResponse
    {
        $customer = User::with(['orders' => function ($q) {
            $q->latest()->with('items');
        }])
        ->withCount('orders')
        ->withSum(['orders' => function ($q) {
            $q->where('status', '!=', 'cancelled');
        }], 'total')
        ->where('id', $id)
        ->first();

        if (!$customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mijoz topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'status' => 'success',
            'data' => $customer,
        ], Response::HTTP_OK);
    }
}
