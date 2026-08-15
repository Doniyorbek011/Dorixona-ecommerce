<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    const FREE_DELIVERY_THRESHOLD = 150000.00;
    const STANDARD_DELIVERY_PRICE = 15000.00;

    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Create a new order from the authenticated user's current shopping cart.
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $user = $request->user();

        // 1. Double-click / Idempotency protection lock
        $idempotencyKey = $request->input('idempotency_key') ?: "order_lock_user_{$user->id}";
        $lockKey = "order_submission_lock_{$idempotencyKey}";

        if (!Cache::add($lockKey, true, now()->addSeconds(5))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buyurtma allaqachon qayta ishlanmoqda. Iltimos, biroz kuting.',
            ], Response::HTTP_CONFLICT);
        }

        try {
            // 2. Fetch user's cart items
            $cartItems = CartItem::with('product')
                ->where('user_id', $user->id)
                ->get();

            if ($cartItems->isEmpty()) {
                Cache::forget($lockKey);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Savatingiz bo‘sh. Buyurtma berish uchun mahsulot tanlang.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // 3. Stock availability verification
            foreach ($cartItems as $item) {
                $product = $item->product;
                if (!$product || !$product->status) {
                    Cache::forget($lockKey);
                    return response()->json([
                        'status' => 'error',
                        'message' => "«" . ($product ? $product->name : 'Noma’lum mahsulot') . "» sotuvda mavjud emas.",
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }

                if ($product->stock < $item->quantity) {
                    Cache::forget($lockKey);
                    return response()->json([
                        'status' => 'error',
                        'message' => "«{$product->name}» mahsulotidan faqat {$product->stock} dona qolgan.",
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
            }

            // 4. Execute atomic transaction
            $order = DB::transaction(function () use ($user, $cartItems, $request) {
                $subtotal = 0.00;

                // Pre-calculate subtotal with live snapshot prices
                foreach ($cartItems as $item) {
                    $unitPrice = $item->product->final_price;
                    $subtotal += ($unitPrice * $item->quantity);
                }

                $deliveryPrice = ($subtotal >= self::FREE_DELIVERY_THRESHOLD || $subtotal === 0.00)
                    ? 0.00
                    : self::STANDARD_DELIVERY_PRICE;

                $total = $subtotal + $deliveryPrice;

                // Create Order record
                $newOrder = Order::create([
                    'user_id' => $user->id,
                    'customer_name' => $request->customer_name,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'note' => $request->note,
                    'subtotal' => $subtotal,
                    'delivery_price' => $deliveryPrice,
                    'total' => $total,
                    'payment_method' => $request->payment_method,
                    'payment_status' => 'pending',
                    'status' => 'new',
                ]);

                // Create Order Items and decrement stock
                foreach ($cartItems as $item) {
                    $product = $item->product;
                    $unitPrice = $product->final_price;
                    $itemSubtotal = $unitPrice * $item->quantity;

                    OrderItem::create([
                        'order_id' => $newOrder->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name, // Snapshot
                        'price' => $unitPrice,            // Snapshot
                        'quantity' => $item->quantity,
                        'subtotal' => $itemSubtotal,
                    ]);

                    // Decrement stock
                    $product->decrement('stock', $item->quantity);
                }

                // Clear user's shopping cart
                CartItem::where('user_id', $user->id)->delete();

                return $newOrder;
            });

            // 5. Initialize payment processing
            $paymentResult = $this->paymentService->process($order, $request->payment_method);

            Cache::forget($lockKey);

            return response()->json([
                'status' => 'success',
                'message' => 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
                'order' => $order->load(['items.product', 'user']),
                'payment' => $paymentResult,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            Cache::forget($lockKey);
            return response()->json([
                'status' => 'error',
                'message' => 'Buyurtma yaratishda kutilmagan xatolik yuz berdi: ' . $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get the authenticated user's order history.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::with('items')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $orders->items(),
            'pagination' => [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Get specific order details for the authenticated user.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $order = Order::with(['items.product', 'user'])
            ->where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buyurtma topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'status' => 'success',
            'data' => $order,
        ], Response::HTTP_OK);
    }

    /**
     * Admin: Get all orders in system with filters.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Order::with(['user', 'items']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%");
            });
        }

        $orders = $query->latest()->paginate(15);

        return response()->json([
            'status' => 'success',
            'data' => $orders->items(),
            'pagination' => [
                'total' => $orders->total(),
                'per_page' => $orders->perPage(),
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Admin: Update order status or payment status.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buyurtma topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        $validated = $request->validate([
            'status' => ['sometimes', 'required', 'in:new,confirmed,preparing,shipping,delivered,cancelled'],
            'payment_status' => ['sometimes', 'required', 'in:pending,paid,failed,refunded'],
        ]);

        $order->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Buyurtma holati yangilandi.',
            'data' => $order,
        ], Response::HTTP_OK);
    }
}
