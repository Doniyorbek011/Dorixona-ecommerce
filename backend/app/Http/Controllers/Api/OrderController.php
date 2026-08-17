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
     * Create a new order (supports both authenticated users and guest checkout).
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        // 1. Resolve user optionally (null for guests)
        $user = auth('sanctum')->user() ?: $request->user();

        // 2. Double-click / Idempotency protection lock
        $idempotencyKey = $request->input('idempotency_key')
            ?: ($user ? "order_lock_user_{$user->id}" : "order_lock_guest_" . md5($request->ip() . '_' . $request->phone));
        $lockKey = "order_submission_lock_{$idempotencyKey}";

        if (!Cache::add($lockKey, true, now()->addSeconds(5))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buyurtma allaqachon qayta ishlanmoqda. Iltimos, biroz kuting.',
            ], Response::HTTP_CONFLICT);
        }

        try {
            // 3. Resolve cart items
            $orderItemsData = [];

            if ($user) {
                // Authenticated user: fetch from database cart
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

                foreach ($cartItems as $item) {
                    $orderItemsData[] = [
                        'product' => $item->product,
                        'quantity' => (int)$item->quantity,
                    ];
                }
            } else {
                // Guest customer: read items array from request body
                $inputItems = $request->input('items', []);

                if (empty($inputItems)) {
                    Cache::forget($lockKey);
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Savatingiz bo‘sh. Buyurtma berish uchun mahsulot tanlang.',
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }

                foreach ($inputItems as $item) {
                    $product = Product::find($item['product_id']);
                    $orderItemsData[] = [
                        'product' => $product,
                        'quantity' => (int)($item['quantity'] ?? 1),
                    ];
                }
            }

            // 4. Stock availability & product active status verification
            foreach ($orderItemsData as $itemData) {
                $product = $itemData['product'];
                $quantity = $itemData['quantity'];

                if (!$product || !$product->status) {
                    Cache::forget($lockKey);
                    return response()->json([
                        'status' => 'error',
                        'message' => "«" . ($product ? $product->name : 'Noma’lum mahsulot') . "» sotuvda mavjud emas.",
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }

                if ($product->stock < $quantity) {
                    Cache::forget($lockKey);
                    return response()->json([
                        'status' => 'error',
                        'message' => "«{$product->name}» mahsulotidan faqat {$product->stock} dona qolgan.",
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
            }

            // 5. Execute atomic order creation transaction
            $order = DB::transaction(function () use ($user, $orderItemsData, $request) {
                $subtotal = 0.00;

                // Pre-calculate subtotal strictly using database snapshot prices (never trust client)
                foreach ($orderItemsData as $itemData) {
                    $product = $itemData['product'];
                    $quantity = $itemData['quantity'];
                    $unitPrice = $product->final_price;
                    $subtotal += ($unitPrice * $quantity);
                }

                $deliveryPrice = ($subtotal >= self::FREE_DELIVERY_THRESHOLD || $subtotal === 0.00)
                    ? 0.00
                    : self::STANDARD_DELIVERY_PRICE;

                $total = $subtotal + $deliveryPrice;

                // Create Order record (user_id is null for guests)
                $newOrder = Order::create([
                    'user_id' => $user?->id,
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


                // Create Order Items and handle conditional stock decrement
                foreach ($orderItemsData as $itemData) {
                    $product = $itemData['product'];
                    $quantity = $itemData['quantity'];
                    $unitPrice = $product->final_price;
                    $itemSubtotal = $unitPrice * $quantity;

                    OrderItem::create([
                        'order_id' => $newOrder->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name, // Snapshot
                        'price' => $unitPrice,            // Snapshot
                        'quantity' => $quantity,
                        'subtotal' => $itemSubtotal,
                    ]);

                    /*
                    |--------------------------------------------------------------------------
                    | BUSINESS RULE: INVENTORY / STOCK DEDUCTION
                    |--------------------------------------------------------------------------
                    | - For Cash on delivery ('cash'): Stock is decremented immediately because
                    |   the order is confirmed directly for courier delivery.
                    | - For Online gateways ('click', 'payme', 'uzum'): Stock is NOT decremented
                    |   at order creation. The order stays in 'pending' payment status and inventory
                    |   remains available for other customers until the payment webhook callback
                    |   verifies the transaction and confirms the payment.
                    */
                    if ($request->payment_method === 'cash') {
                        $product->decrement('stock', $quantity);
                    }
                }

                // If authenticated, clear user's database shopping cart
                if ($user) {
                    CartItem::where('user_id', $user->id)->delete();
                }

                return $newOrder;
            });

            // 6. Initialize payment processing
            $paymentResult = $this->paymentService->process($order, $request->payment_method);

            Cache::forget($lockKey);

            return response()->json([
                'status' => 'success',
                'message' => 'Buyurtmangiz muvaffaqiyatli qabul qilindi!',
                'order' => $order->load(['items.product', 'user']),
                'payment' => $paymentResult,
                'requires_redirect' => $paymentResult['requires_redirect'] ?? false,
                'redirect_url' => $paymentResult['redirect_url'] ?? null,
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            Cache::forget($lockKey);
            return response()->json([
                'status' => 'error',
                'message' => 'Buyurtmani rasmiylashtirishda kutilmagan xatolik yuz berdi: ' . $e->getMessage(),
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
