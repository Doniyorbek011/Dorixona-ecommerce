<?php

namespace Database\Seeders;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'user@apteka.uz')->first();
        if (!$user) {
            return;
        }

        $p1 = Product::where('slug', 'paratsetamol-500-mg-n10')->first();
        $p2 = Product::where('slug', 'vitamin-c-1000-mg-n20')->first();
        $p3 = Product::where('slug', 'avtomatik-tonometr-omron-m2-basic')->first();
        $p4 = Product::where('slug', 'magne-b6-forte-n50')->first();
        $p5 = Product::where('slug', 'bepanten-malham-5-30g')->first();
        $p6 = Product::where('slug', 'omega-3-premium-1000-mg-n60')->first();

        // Sample Order 1: Delivered
        if ($p1 && $p2) {
            $item1Price = $p1->final_price;
            $item2Price = $p2->final_price;
            $subtotal = ($item1Price * 2) + ($item2Price * 1);
            $delivery = 15000.00;
            $total = $subtotal + $delivery;

            $order1 = Order::create([
                'user_id' => $user->id,
                'customer_name' => $user->name,
                'phone' => $user->phone,
                'address' => $user->address,
                'note' => 'Iltimos, soat 18:00 dan keyin yetkazib bering.',
                'subtotal' => $subtotal,
                'delivery_price' => $delivery,
                'total' => $total,
                'payment_method' => 'payme',
                'payment_status' => 'paid',
                'status' => 'delivered',
            ]);

            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $p1->id,
                'product_name' => $p1->name,
                'price' => $item1Price,
                'quantity' => 2,
                'subtotal' => $item1Price * 2,
            ]);

            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => $p2->id,
                'product_name' => $p2->name,
                'price' => $item2Price,
                'quantity' => 1,
                'subtotal' => $item2Price * 1,
            ]);
        }

        // Sample Order 2: Processing
        if ($p3 && $p4) {
            $item3Price = $p3->final_price;
            $item4Price = $p4->final_price;
            $subtotal2 = ($item3Price * 1) + ($item4Price * 1);
            $delivery2 = 0.00; // Free delivery for higher amount
            $total2 = $subtotal2 + $delivery2;

            $order2 = Order::create([
                'user_id' => $user->id,
                'customer_name' => $user->name,
                'phone' => $user->phone,
                'address' => $user->address,
                'note' => 'Eshik qo‘ng‘irog‘i ishlamaydi, yetib kelgach telefon qiling.',
                'subtotal' => $subtotal2,
                'delivery_price' => $delivery2,
                'total' => $total2,
                'payment_method' => 'cash',
                'payment_status' => 'pending',
                'status' => 'preparing',
            ]);

            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $p3->id,
                'product_name' => $p3->name,
                'price' => $item3Price,
                'quantity' => 1,
                'subtotal' => $item3Price * 1,
            ]);

            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => $p4->id,
                'product_name' => $p4->name,
                'price' => $item4Price,
                'quantity' => 1,
                'subtotal' => $item4Price * 1,
            ]);
        }

        // Demo Cart Items
        if ($p5 && $p6) {
            CartItem::updateOrCreate(
                ['user_id' => $user->id, 'product_id' => $p5->id],
                ['quantity' => 1]
            );

            CartItem::updateOrCreate(
                ['user_id' => $user->id, 'product_id' => $p6->id],
                ['quantity' => 2]
            );
        }
    }
}
