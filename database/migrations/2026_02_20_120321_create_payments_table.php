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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Plan comprado
            $table->enum('plan', ['premium_monthly', 'premium_yearly']);
            
            // Monto del pago
            $table->decimal('amount', 8, 2);
            
            // Status: pending, completed, failed
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            
            // Método de pago simulado
            $table->string('payment_method')->default('credit_card');
            
            // ID de transacción único
            $table->string('transaction_id')->unique();
            
            // Últimos 4 dígitos de tarjeta (simulado)
            $table->string('card_last_four', 4)->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->index('user_id');
            $table->index('status');
            $table->index('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};