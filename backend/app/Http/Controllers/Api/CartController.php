<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\SyncCartRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CartController extends Controller
{
    const FREE_DELIVERY_THRESHOLD = 150000.00; // Free delivery for orders >= 150,000 UZS
    const STANDARD_DELIVERY_PRICE = 15000.00;  // Standard delivery 15,000 UZS

    /**
     * Get the authenticated user's cart with recalculations.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        return $this->formatCartResponse($user);
    }

    /**
     * Add a product to the authenticated user's cart.
     */
    public function store(AddToCartRequest $request): JsonResponse
    {
        $user = $request->user();
        $productId = (int) $request->product_id;
        $quantity = (int) ($request->quantity ?? 1);

        $product = Product::where('id', $productId)->where('status', true)->first();
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Mahsulot topilmadi yoki sotuvdan olingan.',
            ], Response::HTTP_NOT_FOUND);
        }

        if ($product->stock < 1) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ushbu mahsulot hozirda omborda qolmagan.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantity;
            if ($newQuantity > $product->stock) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Omborda faqat {$product->stock} dona mahsulot mavjud.",
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            if ($quantity > $product->stock) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Omborda faqat {$product->stock} dona mahsulot mavjud.",
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return $this->formatCartResponse($user, 'Mahsulot savatga muvaffaqiyatli qo‘shildi.');
    }

    /**
     * Update quantity for a specific cart item.
     */
    public function update(UpdateCartItemRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $cartItem = CartItem::with('product')->where('user_id', $user->id)->where('id', $id)->first();

        if (!$cartItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Savat elementi topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        $quantity = (int) $request->quantity;
        $product = $cartItem->product;

        if ($product && $quantity > $product->stock) {
            return response()->json([
                'status' => 'error',
                'message' => "Maksimal mavjud miqdor: {$product->stock} dona.",
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cartItem->quantity = $quantity;
        $cartItem->save();

        return $this->formatCartResponse($user, 'Savat yangilandi.');
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $cartItem = CartItem::where('user_id', $user->id)->where('id', $id)->first();

        if ($cartItem) {
            $cartItem->delete();
        }

        return $this->formatCartResponse($user, 'Mahsulot savatdan o‘chirildi.');
    }

    /**
     * Clear all items from the user's cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $user = $request->user();
        CartItem::where('user_id', $user->id)->delete();

        return $this->formatCartResponse($user, 'Savat tozalandi.');
    }

    /**
     * Merge guest cart items into authenticated user's cart upon login.
     */
    public function sync(SyncCartRequest $request): JsonResponse
    {
        $user = $request->user();
        $items = $request->input('items', []);

        foreach ($items as $item) {
            $productId = (int) $item['product_id'];
            $quantity = (int) $item['quantity'];

            $product = Product::where('id', $productId)->where('status', true)->first();
            if (!$product || $product->stock < 1) {
                continue;
            }

            $cartItem = CartItem::where('user_id', $user->id)->where('product_id', $productId)->first();

            if ($cartItem) {
                $mergedQty = min($cartItem->quantity + $quantity, $product->stock);
                $cartItem->quantity = $mergedQty;
                $cartItem->save();
            } else {
                $qty = min($quantity, $product->stock);
                CartItem::create([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                    'quantity' => $qty,
                ]);
            }
        }

        return $this->formatCartResponse($user, 'Savat sinxronlashtirildi.');
    }

    /**
     * Helper to recalculate server-side prices, delivery, and totals.
     */
    private function formatCartResponse($user, ?string $message = null): JsonResponse
    {
        $cartItems = CartItem::with(['product' => function ($q) {
            $q->with('category:id,name_uz,name_ru,slug');
        }])
        ->where('user_id', $user->id)
        ->get();

        $formattedItems = [];
        $subtotal = 0.00;
        $totalItemsCount = 0;

        foreach ($cartItems as $item) {
            $product = $item->product;
            if (!$product) {
                continue;
            }

            // Always recalculate price from database
            $unitPrice = $product->final_price;
            $originalPrice = (float) $product->price;
            $itemSubtotal = $unitPrice * $item->quantity;

            $subtotal += $itemSubtotal;
            $totalItemsCount += $item->quantity;

            $formattedItems[] = [
                'id' => $item->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'brand' => $product->brand,
                'image' => $product->image,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name_uz' => $product->category->name_uz,
                    'name_ru' => $product->category->name_ru,
                    'slug' => $product->category->slug,
                ] : null,
                'price' => $originalPrice,
                'unit_price' => $unitPrice,
                'has_discount' => $product->discount_price !== null && $product->discount_price > 0,
                'quantity' => $item->quantity,
                'stock' => $product->stock,
                'subtotal' => $itemSubtotal,
            ];
        }

        $deliveryPrice = ($subtotal >= self::FREE_DELIVERY_THRESHOLD || $subtotal === 0.00)
            ? 0.00
            : self::STANDARD_DELIVERY_PRICE;

        $total = $subtotal > 0 ? ($subtotal + $deliveryPrice) : 0.00;
        $freeDeliveryRemaining = max(0.00, self::FREE_DELIVERY_THRESHOLD - $subtotal);

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => [
                'items' => $formattedItems,
                'items_count' => count($formattedItems),
                'total_quantity' => $totalItemsCount,
                'subtotal' => $subtotal,
                'delivery_price' => $deliveryPrice,
                'free_delivery_threshold' => self::FREE_DELIVERY_THRESHOLD,
                'free_delivery_remaining' => $freeDeliveryRemaining,
                'is_free_delivery' => $subtotal >= self::FREE_DELIVERY_THRESHOLD && $subtotal > 0,
                'total' => $total,
            ],
        ], Response::HTTP_OK);
    }
}
