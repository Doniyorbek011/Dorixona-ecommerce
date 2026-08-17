<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('provider', 50)->index(); // 'click', 'payme', 'uzum', 'cash', 'card'
            $table->string('provider_transaction_id')->nullable()->index();
            $table->decimal('amount', 12, 2);
            $table->string('status', 50)->default('pending')->index(); // 'pending', 'paid', 'failed', 'cancelled', 'refunded'
            $table->json('raw_payload')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
