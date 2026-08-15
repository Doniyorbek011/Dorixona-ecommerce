<?php

use App\Http\Controllers\Api\Admin\CustomerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\InventoryController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Apteka API is running smoothly',
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Authentication endpoints (Throttled for brute-force security)
Route::prefix('auth')->middleware('throttle:15,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Categories public endpoints
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{idOrSlug}', [CategoryController::class, 'show']);

// Products public endpoints
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/search/autocomplete', [ProductController::class, 'autocomplete'])->middleware('throttle:60,1');
Route::get('/products/brands', [ProductController::class, 'brands']);
Route::get('/products/{idOrSlug}', [ProductController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Current authenticated user profile
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Shopping Cart endpoints
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{id}', [CartController::class, 'update']);
        Route::delete('/{id}', [CartController::class, 'destroy']);
        Route::delete('/', [CartController::class, 'clear']);
        Route::post('/sync', [CartController::class, 'sync']);
    });

    // Orders endpoints (Throttled to prevent rapid submission attacks)
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store'])->middleware('throttle:15,1');
        Route::get('/{id}', [OrderController::class, 'show']);
    });

    /*
    |--------------------------------------------------------------------------
    | Protected Admin Routes (Sanctum + Admin Middleware)
    |--------------------------------------------------------------------------
    */
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Admin dashboard stats & charts
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        // Admin categories CRUD
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Admin products CRUD
        Route::get('/products', [ProductController::class, 'adminIndex']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::post('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Admin order management
        Route::get('/orders', [OrderController::class, 'adminIndex']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // Admin customer management
        Route::get('/customers', [CustomerController::class, 'index']);
        Route::get('/customers/{id}', [CustomerController::class, 'show']);

        // Admin inventory monitoring & quick stock update
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::put('/inventory/{id}/stock', [InventoryController::class, 'updateStock']);
    });
});
