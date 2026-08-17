<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\PaymentTransaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CancelAbandonedPaymentsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:cancel-abandoned';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically cancel pending online payment orders older than 30 minutes.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $cutoffTime = now()->subMinutes(30);

        // Find abandoned online orders (non-cash, still pending, created > 30 mins ago)
        $abandonedOrders = Order::where('payment_method', '!=', 'cash')
            ->where('payment_status', 'pending')
            ->where('status', 'new')
            ->where('created_at', '<=', $cutoffTime)
            ->get();

        if ($abandonedOrders->isEmpty()) {
            $this->info('No abandoned orders found.');
            return Command::SUCCESS;
        }

        $count = 0;
        foreach ($abandonedOrders as $order) {
            $order->update([
                'status' => 'cancelled',
                'payment_status' => 'failed',
            ]);

            PaymentTransaction::create([
                'order_id' => $order->id,
                'provider' => $order->payment_method,
                'provider_transaction_id' => null,
                'amount' => $order->total,
                'status' => 'failed',
                'raw_payload' => [
                    'reason' => 'abandoned_payment_timeout_30m',
                    'cancelled_at' => now()->toIso8601String(),
                ],
            ]);

            $count++;
        }

        Log::info("Cancelled {$count} abandoned online payment order(s).");
        $this->info("Successfully cancelled {$count} abandoned order(s).");

        return Command::SUCCESS;
    }
}
