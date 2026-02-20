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
        Schema::create('ai_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Role: user, assistant
            $table->enum('role', ['user', 'assistant']);
            
            // Mensaje de la conversación
            $table->longText('message');
            
            // Metadata adicional (JSON) - para tokens, modelo usado, etc.
            $table->json('metadata')->nullable();
            
            $table->timestamp('created_at');
            
            // Índices
            $table->index('user_id');
            $table->index('role');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_conversations');
    }
};