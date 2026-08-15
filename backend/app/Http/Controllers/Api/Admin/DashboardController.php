<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class DashboardController extends Controller
{
    /**
     * Get aggregated stats, alerts, charts data, and recent activity for the admin dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        // 1. KPI Stats Cards
        $totalSales = (float) Order::where('status', '!=', 'cancelled')->sum('total');
        $totalOrders = Order::count();
        $totalCustomers = User::where('role', 'user')->count();
        $totalProducts = Product::count();

        // 2. Inventory & Order Alerts
        $lowStockCount = Product::where('stock', '>', 0)->where('stock', '<=', 10)->count();
        $outOfStockCount = Product::where('stock', 0)->count();
        $newOrdersCount = Order::where('status', 'new')->count();

        $lowStockProducts = Product::with('category:id,name_uz,name_ru')
            ->where('stock', '<=', 10)
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get();

        $recentNewOrders = Order::with('items')
            ->where('status', 'new')
            ->latest()
            ->limit(5)
            ->get();

        // 3. 7-Day Sales & Orders Chart Series
        $dailySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dayLabel = Carbon::now()->subDays($i)->format('d M');

            $dayRevenue = (float) Order::whereDate('created_at', $date)
                ->where('status', '!=', 'cancelled')
                ->sum('total');

            $dayOrders = Order::whereDate('created_at', $date)->count();

            $dailySales[] = [
                'date' => $date,
                'day' => $dayLabel,
                'revenue' => $dayRevenue,
                'orders' => $dayOrders,
            ];
        }

        // 4. Categories Distribution
        $categoriesDistribution = Category::withCount('products')
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name_uz,
                    'name_ru' => $cat->name_ru,
                    'products_count' => $cat->products_count,
                ];
            });

        // 5. Recent Orders (all statuses)
        $recentOrders = Order::with('user:id,name,email,phone')
            ->latest()
            ->limit(6)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => [
                    'total_sales' => $totalSales,
                    'total_orders' => $totalOrders,
                    'total_customers' => $totalCustomers,
                    'total_products' => $totalProducts,
                ],
                'alerts' => [
                    'low_stock_count' => $lowStockCount,
                    'out_of_stock_count' => $outOfStockCount,
                    'new_orders_count' => $newOrdersCount,
                    'low_stock_products' => $lowStockProducts,
                    'recent_new_orders' => $recentNewOrders,
                ],
                'charts' => [
                    'daily_sales' => $dailySales,
                    'categories_distribution' => $categoriesDistribution,
                ],
                'recent_orders' => $recentOrders,
            ],
        ], Response::HTTP_OK);
    }
}
