<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PaymentTransaction;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        PaymentTransaction::create([
            'order_id' => $order->id,
            'provider' => 'cash',
            'provider_transaction_id' => null,
            'amount' => $order->total,
            'status' => 'pending',
            'raw_payload' => [
                'type' => 'cash_on_delivery',
                'order_id' => $order->id,
                'total' => $order->total,
            ],
        ]);

        return [
            'success' => true,
            'payment_method' => 'cash',
            'payment_status' => 'pending',
            'requires_redirect' => false,
            'redirect_url' => null,
            'message' => 'To‘lov usuli: Kuryerga naqd pul orqali to‘lov.',
        ];
    }

    /**
     * Payme Checkout URL builder and handler.
     * Documented format: https://checkout.paycom.uz/{base64(m=merchant_id;ac.order_id=order_id;a=amount_in_tiyin;c=return_url)}
     */
    protected function processPaymePayment(Order $order): array
    {
        $merchantId = config('services.payme.merchant_id') ?: 'demo_merchant_id';
        $amountInTiyin = (int) round($order->total * 100);
        $returnUrl = $this->getFrontendReturnUrl($order);

        $params = "m={$merchantId};ac.order_id={$order->id};a={$amountInTiyin};c={$returnUrl}";
        $encodedParams = base64_encode($params);
        $checkoutUrl = "https://checkout.paycom.uz/{$encodedParams}";

        $order->payment_method = 'payme';
        $order->payment_status = 'pending';
        $order->save();

        PaymentTransaction::create([
            'order_id' => $order->id,
            'provider' => 'payme',
            'provider_transaction_id' => null,
            'amount' => $order->total,
            'status' => 'pending',
            'raw_payload' => [
                'checkout_params' => $params,
                'checkout_url' => $checkoutUrl,
            ],
        ]);

        return [
            'success' => true,
            'payment_method' => 'payme',
            'payment_status' => 'pending',
            'requires_redirect' => true,
            'redirect_url' => $checkoutUrl,
            'message' => 'Payme to‘lov oynasiga yo‘naltirilmoqda.',
        ];
    }

    /**
     * Click.uz Shop API URL builder and handler.
     * Documented format: https://my.click.uz/services/pay?service_id={service_id}&merchant_id={merchant_id}&amount={amount}&transaction_param={order_id}&return_url={return_url}
     */
    protected function processClickPayment(Order $order): array
    {
        $merchantId = config('services.click.merchant_id') ?: 'demo_merchant_id';
        $serviceId = config('services.click.service_id') ?: 'demo_service_id';
        $amountFormatted = number_format($order->total, 2, '.', '');
        $returnUrl = urlencode($this->getFrontendReturnUrl($order));

        $checkoutUrl = "https://my.click.uz/services/pay?service_id={$serviceId}&merchant_id={$merchantId}&amount={$amountFormatted}&transaction_param={$order->id}&return_url={$returnUrl}";

        $order->payment_method = 'click';
        $order->payment_status = 'pending';
        $order->save();

        PaymentTransaction::create([
            'order_id' => $order->id,
            'provider' => 'click',
            'provider_transaction_id' => null,
            'amount' => $order->total,
            'status' => 'pending',
            'raw_payload' => [
                'checkout_url' => $checkoutUrl,
                'amount' => $amountFormatted,
            ],
        ]);

        return [
            'success' => true,
            'payment_method' => 'click',
            'payment_status' => 'pending',
            'requires_redirect' => true,
            'redirect_url' => $checkoutUrl,
            'message' => 'Click to‘lov oynasiga yo‘naltirilmoqda.',
        ];
    }

    /**
     * Uzum Bank merchant checkout builder and handler.
     * Documented format / initialization URL per Uzum Bank Open API.
     */
    protected function processUzumPayment(Order $order): array
    {
        $merchantId = config('services.uzum.merchant_id') ?: 'demo_merchant_id';
        $amountInTiyin = (int) round($order->total * 100);
        $returnUrl = urlencode($this->getFrontendReturnUrl($order));

        /**
         * TODO: If server-to-server initialization is required by Uzum Bank Merchant API:
         * Endpoint: POST https://api.uzumbank.uz/open-service/v1/orders/initiate
         * Headers: ['Authorization' => 'Bearer ' . $secretKey, 'Content-Type' => 'application/json']
         * Body: ['merchantId' => $merchantId, 'orderId' => (string)$order->id, 'amount' => $amountInTiyin, 'returnUrl' => $returnUrl]
         * Response: ['checkoutUrl' => 'https://uzumbank.uz/pay/...', 'paymentId' => '...']
         */
        $checkoutUrl = "https://www.uzumbank.uz/open-service?service_id={$merchantId}&order_id={$order->id}&amount={$amountInTiyin}&return_url={$returnUrl}";

        $order->payment_method = 'uzum';
        $order->payment_status = 'pending';
        $order->save();

        PaymentTransaction::create([
            'order_id' => $order->id,
            'provider' => 'uzum',
            'provider_transaction_id' => null,
            'amount' => $order->total,
            'status' => 'pending',
            'raw_payload' => [
                'checkout_url' => $checkoutUrl,
                'amount_in_tiyin' => $amountInTiyin,
            ],
        ]);

        return [
            'success' => true,
            'payment_method' => 'uzum',
            'payment_status' => 'pending',
            'requires_redirect' => true,
            'redirect_url' => $checkoutUrl,
            'message' => 'Uzum Bank to‘lov oynasiga yo‘naltirilmoqda.',
        ];
    }

    /**
     * Card payment integration hook.
     */
    protected function processCardPayment(Order $order): array
    {
        $order->payment_method = 'card';
        $order->payment_status = 'pending';
        $order->save();

        return [
            'success' => true,
            'payment_method' => 'card',
            'payment_status' => 'pending',
            'requires_redirect' => false,
            'redirect_url' => null,
            'message' => 'Bank kartasi orqali to‘lov.',
        ];
    }

    /**
     * Frontend redirect return URL after checkout completes at provider.
     */
    public function getFrontendReturnUrl(Order $order): string
    {
        $frontendUrl = rtrim(env('FRONTEND_URL', config('app.url', 'http://localhost:5173')), '/');
        return "{$frontendUrl}/profile";
    }

    /*
    |--------------------------------------------------------------------------
    | Inventory Verification & Order Confirmation Lifecycle
    |--------------------------------------------------------------------------
    */

    /**
     * Confirm order payment and atomically verify/decrement inventory stock.
     */
    public function confirmOrderPayment(Order $order, string $provider, ?string $providerTransactionId, array $rawPayload): array
    {
        return DB::transaction(function () use ($order, $provider, $providerTransactionId, $rawPayload) {
            // Load items and associated products
            $order->load('items');

            // Idempotency: If already paid, return without double-decrementing stock
            if ($order->payment_status === 'paid') {
                return [
                    'success' => true,
                    'status' => 'ALREADY_PAID',
                    'order' => $order,
                ];
            }

            // 1. Check stock availability for all items
            $insufficientStockItems = [];
            foreach ($order->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);
                if (!$product || $product->stock < $item->quantity) {
                    $insufficientStockItems[] = [
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'requested' => $item->quantity,
                        'available' => $product ? $product->stock : 0,
                    ];
                }
            }

            // 2. Edge case: Product sold out while online payment was pending
            if (!empty($insufficientStockItems)) {
                Log::critical("Order #{$order->id} payment confirmed via {$provider} but items are out of stock! Refund required.", [
                    'order_id' => $order->id,
                    'provider' => $provider,
                    'provider_transaction_id' => $providerTransactionId,
                    'insufficient_items' => $insufficientStockItems,
                ]);

                // Mark order as cancelled due to payment/stock failure
                $order->update([
                    'status' => 'cancelled',
                    'payment_status' => 'failed',
                ]);

                PaymentTransaction::create([
                    'order_id' => $order->id,
                    'provider' => $provider,
                    'provider_transaction_id' => $providerTransactionId,
                    'amount' => $order->total,
                    'status' => 'failed',
                    'raw_payload' => array_merge($rawPayload, [
                        'refund_required' => true,
                        'refund_reason' => 'out_of_stock_after_payment',
                        'insufficient_items' => $insufficientStockItems,
                    ]),
                ]);

                return [
                    'success' => false,
                    'status' => 'OUT_OF_STOCK_REFUND_REQUIRED',
                    'order' => $order,
                ];
            }

            // 3. Stock is available: atomically decrement stock and confirm order
            foreach ($order->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);
                if ($product) {
                    $product->decrement('stock', $item->quantity);
                }
            }

            $order->update([
                'payment_status' => 'paid',
                'status' => 'confirmed',
            ]);

            PaymentTransaction::create([
                'order_id' => $order->id,
                'provider' => $provider,
                'provider_transaction_id' => $providerTransactionId,
                'amount' => $order->total,
                'status' => 'paid',
                'raw_payload' => $rawPayload,
            ]);

            return [
                'success' => true,
                'status' => 'PAID',
                'order' => $order,
            ];
        });
    }

    /**
     * Mark order payment as failed and cancel order without altering stock.
     */
    public function failOrderPayment(Order $order, string $provider, ?string $providerTransactionId, array $rawPayload, ?string $reason = null): array
    {
        $order->update([
            'payment_status' => 'failed',
            'status' => 'cancelled',
        ]);

        PaymentTransaction::create([
            'order_id' => $order->id,
            'provider' => $provider,
            'provider_transaction_id' => $providerTransactionId,
            'amount' => $order->total,
            'status' => 'failed',
            'raw_payload' => array_merge($rawPayload, [
                'failure_reason' => $reason ?: 'payment_failed_callback',
            ]),
        ]);

        return [
            'success' => false,
            'status' => 'FAILED',
            'order' => $order,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Callback / Webhook Processing Methods
    |--------------------------------------------------------------------------
    */

    /**
     * Handle Click Shop API Callback (Prepare & Complete).
     */
    public function handleClickCallback(array $params): array
    {
        $secretKey = config('services.click.secret_key');
        $clickTransId = $params['click_trans_id'] ?? null;
        $serviceId = $params['service_id'] ?? null;
        $merchantTransId = $params['merchant_trans_id'] ?? null; // Order ID
        $merchantPrepareId = $params['merchant_prepare_id'] ?? '';
        $amount = $params['amount'] ?? null;
        $action = isset($params['action']) ? (int)$params['action'] : null;
        $error = $params['error'] ?? 0;
        $signTime = $params['sign_time'] ?? '';
        $signString = $params['sign_string'] ?? '';

        // 1. Verify Secret Key & Signature
        if (empty($secretKey)) {
            Log::warning('Click callback received but CLICK_SECRET_KEY is not configured in .env');
        }

        $expectedSign = ($action === 1)
            ? md5($clickTransId . $serviceId . $secretKey . $merchantTransId . $merchantPrepareId . $amount . $action . $signTime)
            : md5($clickTransId . $serviceId . $secretKey . $merchantTransId . $amount . $action . $signTime);

        if (empty($signString) || strtolower($signString) !== strtolower($expectedSign)) {
            Log::error("Click signature mismatch. Expected: {$expectedSign}, Received: {$signString}", $params);
            return [
                'error' => -1,
                'error_note' => 'SIGN CHECK FAILED',
            ];
        }

        // 2. Find Order
        $order = Order::find($merchantTransId);
        if (!$order) {
            Log::error("Click callback: Order #{$merchantTransId} not found.");
            return [
                'error' => -5,
                'error_note' => 'User does not exist',
            ];
        }

        // 3. Verify Amount
        if (abs((float)$order->total - (float)$amount) > 0.01) {
            Log::error("Click callback: Amount mismatch for order #{$order->id}. Order: {$order->total}, Callback: {$amount}");
            return [
                'error' => -2,
                'error_note' => 'Incorrect parameter amount',
            ];
        }

        // 4. Action handling
        if ($action === 0) {
            // Prepare action: log attempt
            PaymentTransaction::create([
                'order_id' => $order->id,
                'provider' => 'click',
                'provider_transaction_id' => (string)$clickTransId,
                'amount' => $order->total,
                'status' => 'pending',
                'raw_payload' => $params,
            ]);

            return [
                'click_trans_id' => $clickTransId,
                'merchant_trans_id' => $order->id,
                'merchant_prepare_id' => $order->id,
                'error' => 0,
                'error_note' => 'Success',
            ];
        }

        if ($action === 1) {
            // Complete action
            if ($error < 0) {
                $this->failOrderPayment($order, 'click', (string)$clickTransId, $params, 'click_error_' . $error);

                return [
                    'click_trans_id' => $clickTransId,
                    'merchant_trans_id' => $order->id,
                    'merchant_confirm_id' => $order->id,
                    'error' => $error,
                    'error_note' => 'Failed',
                ];
            }

            // Success action: Atomically check stock and decrement
            $confirmResult = $this->confirmOrderPayment($order, 'click', (string)$clickTransId, $params);

            if (!$confirmResult['success']) {
                return [
                    'click_trans_id' => $clickTransId,
                    'merchant_trans_id' => $order->id,
                    'merchant_confirm_id' => $order->id,
                    'error' => -9,
                    'error_note' => 'Out of stock after payment',
                ];
            }

            return [
                'click_trans_id' => $clickTransId,
                'merchant_trans_id' => $order->id,
                'merchant_confirm_id' => $order->id,
                'error' => 0,
                'error_note' => 'Success',
            ];
        }

        return [
            'error' => -3,
            'error_note' => 'Action not found',
        ];
    }

    /**
     * Handle Payme JSON-RPC callback.
     */
    public function handlePaymeCallback(array $payload, ?string $authHeader): array
    {
        $secretKey = config('services.payme.secret_key');
        $id = $payload['id'] ?? null;
        $method = $payload['method'] ?? null;
        $params = $payload['params'] ?? [];

        // 1. Verify Authorization Header: Basic <base64("Paycom:" . secret_key)>
        if (!empty($secretKey)) {
            $expectedAuth = 'Basic ' . base64_encode('Paycom:' . $secretKey);
            if (!$authHeader || trim($authHeader) !== $expectedAuth) {
                Log::error('Payme callback authorization failed. Invalid Basic token.');
                return [
                    'jsonrpc' => '2.0',
                    'id' => $id,
                    'error' => [
                        'code' => -32504,
                        'message' => [
                            'ru' => 'Недостаточно привилегий для выполнения метода',
                            'uz' => 'Ushbu amalni bajarish uchun ruxsat yo‘q',
                            'en' => 'Insufficient privileges',
                        ],
                    ],
                ];
            }
        } elseif (empty($authHeader)) {
            Log::error('Payme callback rejected: Missing Authorization header.');
            return [
                'jsonrpc' => '2.0',
                'id' => $id,
                'error' => [
                    'code' => -32504,
                    'message' => [
                        'ru' => 'Недостаточно привилегий для выполнения метода',
                        'uz' => 'Ushbu amalni bajarish uchun ruxsat yo‘q',
                        'en' => 'Insufficient privileges',
                    ],
                ],
            ];
        }

        $orderId = $params['account']['order_id'] ?? null;

        // Process RPC Methods
        switch ($method) {
            case 'CheckPerformTransaction':
                $order = Order::find($orderId);
                if (!$order) {
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'error' => [
                            'code' => -31050,
                            'message' => ['ru' => 'Заказ не найден', 'uz' => 'Buyurtma topilmadi'],
                        ],
                    ];
                }

                $amountInTiyin = (int) round($order->total * 100);
                if (isset($params['amount']) && (int)$params['amount'] !== $amountInTiyin) {
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'error' => [
                            'code' => -31001,
                            'message' => ['ru' => 'Неверная сумма', 'uz' => 'Noto‘g‘ri summa'],
                        ],
                    ];
                }

                return [
                    'jsonrpc' => '2.0',
                    'id' => $id,
                    'result' => [
                        'allow' => true,
                    ],
                ];

            case 'CreateTransaction':
                $order = Order::find($orderId);
                if (!$order) {
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'error' => [
                            'code' => -31050,
                            'message' => ['ru' => 'Заказ не найден', 'uz' => 'Buyurtma topilmadi'],
                        ],
                    ];
                }

                $transId = $params['id'] ?? (string)time();
                PaymentTransaction::create([
                    'order_id' => $order->id,
                    'provider' => 'payme',
                    'provider_transaction_id' => $transId,
                    'amount' => $order->total,
                    'status' => 'pending',
                    'raw_payload' => $payload,
                ]);

                return [
                    'jsonrpc' => '2.0',
                    'id' => $id,
                    'result' => [
                        'create_time' => (int)(microtime(true) * 1000),
                        'transaction' => $transId,
                        'state' => 1,
                    ],
                ];

            case 'PerformTransaction':
                $transId = $params['id'] ?? null;
                $tx = PaymentTransaction::where('provider_transaction_id', $transId)
                    ->where('provider', 'payme')
                    ->first();

                $order = $tx?->order ?: ($orderId ? Order::find($orderId) : null);

                if (!$order) {
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'error' => [
                            'code' => -31050,
                            'message' => ['ru' => 'Заказ не найден', 'uz' => 'Buyurtma topilmadi'],
                        ],
                    ];
                }

                // Atomically verify stock, decrement inventory, and confirm order
                $confirmResult = $this->confirmOrderPayment($order, 'payme', $transId, $payload);

                if (!$confirmResult['success']) {
                    return [
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'error' => [
                            'code' => -31008,
                            'message' => ['ru' => 'Товар распродан во время оплаты', 'uz' => 'Mahsulot tugab qolgan'],
                        ],
                    ];
                }

                return [
                    'jsonrpc' => '2.0',
                    'id' => $id,
                    'result' => [
                        'perform_time' => (int)(microtime(true) * 1000),
                        'transaction' => $transId,
                        'state' => 2,
                    ],
                ];

            case 'CancelTransaction':
                $transId = $params['id'] ?? null;
                $tx = PaymentTransaction::where('provider_transaction_id', $transId)
                    ->where('provider', 'payme')
                    ->first();

                if ($tx?->order) {
                    $this->failOrderPayment($tx->order, 'payme', $transId, $payload, 'payme_cancelled');
                }

                return [
                    'jsonrpc' => '2.0',
                    'id' => $id,
                    'result' => [
                        'cancel_time' => (int)(microtime(true) * 1000),
                        'transaction' => $transId,
                        'state' => -1,
                    ],
                ];

            case 'CheckTransaction':
                $transId = $params['id'] ?? null;
                $tx = PaymentTransaction::where('provider_transaction_id', $transId)
                    ->where('provider', 'payme')
                    ->first();

                return [
                    'jsonrpc' => '2.0',
                    'id' => $id,
                    'result' => [
                        'create_time' => $tx ? $tx->created_at->timestamp * 1000 : (int)(microtime(true) * 1000),
                        'perform_time' => ($tx && $tx->status === 'paid') ? $tx->updated_at->timestamp * 1000 : 0,
                        'cancel_time' => ($tx && $tx->status === 'cancelled') ? $tx->updated_at->timestamp * 1000 : 0,
                        'transaction' => $transId,
                        'state' => ($tx && $tx->status === 'paid') ? 2 : (($tx && $tx->status === 'cancelled') ? -1 : 1),
                        'reason' => null,
                    ],
                ];

            default:
                return [
                    'jsonrpc' => '2.0',
                    'id' => $id,
                    'error' => [
                        'code' => -32601,
                        'message' => ['ru' => 'Метод не найден', 'uz' => 'Metod topilmadi'],
                    ],
                ];
        }
    }

    /**
     * Handle Uzum Bank Webhook Callback.
     */
    public function handleUzumCallback(array $params, ?string $signatureHeader): array
    {
        $secretKey = config('services.uzum.secret_key');
        $orderId = $params['order_id'] ?? $params['orderId'] ?? null;
        $status = $params['status'] ?? 'SUCCESS';
        $transactionId = $params['transaction_id'] ?? $params['paymentId'] ?? null;
        $amount = $params['amount'] ?? null;

        // 1. Verify Signature Header (HMAC-SHA256 of JSON payload with secret key)
        $expectedSignature = hash_hmac('sha256', json_encode($params), (string)$secretKey);
        if (empty($signatureHeader) || !hash_equals($expectedSignature, $signatureHeader)) {
            Log::error('Uzum callback signature verification failed.', [
                'received' => $signatureHeader,
                'expected' => $expectedSignature,
            ]);
            return [
                'success' => false,
                'error' => 'INVALID_SIGNATURE',
                'message' => 'Signature verification failed',
            ];
        }

        // 2. Find Order
        $order = Order::find($orderId);
        if (!$order) {
            Log::error("Uzum callback: Order #{$orderId} not found.");
            return [
                'success' => false,
                'error' => 'ORDER_NOT_FOUND',
                'message' => "Order #{$orderId} not found",
            ];
        }

        // 3. Process Status
        $isSuccess = strtoupper($status) === 'SUCCESS' || strtoupper($status) === 'PAID' || strtoupper($status) === 'CONFIRMED';

        if ($isSuccess) {
            $confirmResult = $this->confirmOrderPayment($order, 'uzum', (string)$transactionId, $params);

            if (!$confirmResult['success']) {
                return [
                    'success' => false,
                    'status' => 'OUT_OF_STOCK_REFUND_REQUIRED',
                    'order_id' => $order->id,
                ];
            }

            return [
                'success' => true,
                'status' => 'PAID',
                'order_id' => $order->id,
            ];
        } else {
            $this->failOrderPayment($order, 'uzum', (string)$transactionId, $params, 'uzum_status_' . $status);

            return [
                'success' => false,
                'status' => 'FAILED',
                'order_id' => $order->id,
            ];
        }
    }
}
