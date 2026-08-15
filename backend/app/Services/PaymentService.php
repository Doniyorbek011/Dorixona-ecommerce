<?php

namespace App\Services;

use App\Models\Order;

class PaymentService
{
    /**
     * Process order payment initialization based on selected method.
     *
     * @param Order $order
     * @param string $paymentMethod ('cash', 'payme', 'click', 'uzum', 'card')
     * @return array
     */
    public function process(Order $order, string $paymentMethod = 'cash'): array
    {
        return match ($paymentMethod) {
            'cash' => $this->processCashPayment($order),
            'payme' => $this->processPaymePayment($order),
            'click' => $this->processClickPayment($order),
            'uzum' => $this->processUzumPayment($order),
            'card' => $this->processCardPayment($order),
            default => $this->processCashPayment($order),
        };
    }

    /**
     * Cash on delivery handler.
     */
    protected function processCashPayment(Order $order): array
    {
        $order->payment_method = 'cash';
        $order->payment_status = 'pending';
        $order->save();

        return [
            'success' => true,
            'payment_method' => 'cash',
            'payment_status' => 'pending',
            'requires_redirect' => false,
            'message' => 'To‘lov usuli: Kuryerga naqd pul orqali to‘lov.',
        ];
    }

    /**
     * Payme integration hook (ready for future phase).
     */
    protected function processPaymePayment(Order $order): array
    {
        return [
            'success' => true,
            'payment_method' => 'payme',
            'payment_status' => 'pending',
            'requires_redirect' => true,
            'redirect_url' => "https://checkout.paycom.uz/" . base64_encode("m=demo;ac.order_id={$order->id};a={$order->total}"),
            'message' => 'Payme orqali to‘lov oynasiga yo‘naltirilmoqda.',
        ];
    }

    /**
     * Click integration hook (ready for future phase).
     */
    protected function processClickPayment(Order $order): array
    {
        return [
            'success' => true,
            'payment_method' => 'click',
            'payment_status' => 'pending',
            'requires_redirect' => true,
            'redirect_url' => "https://my.click.uz/services/pay?service_id=demo&merchant_id=demo&amount={$order->total}&transaction_param={$order->id}",
            'message' => 'Click orqali to‘lov oynasiga yo‘naltirilmoqda.',
        ];
    }

    /**
     * Uzum Bank integration hook (ready for future phase).
     */
    protected function processUzumPayment(Order $order): array
    {
        return [
            'success' => true,
            'payment_method' => 'uzum',
            'payment_status' => 'pending',
            'requires_redirect' => false,
            'message' => 'Uzum Bank orqali to‘lov kutilmoqda.',
        ];
    }

    /**
     * Card payment integration hook.
     */
    protected function processCardPayment(Order $order): array
    {
        return [
            'success' => true,
            'payment_method' => 'card',
            'payment_status' => 'pending',
            'requires_redirect' => false,
            'message' => 'Bank kartasi orqali to‘lov.',
        ];
    }
}
