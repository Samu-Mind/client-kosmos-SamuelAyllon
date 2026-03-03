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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('name');
            $table->text('description')->nullable();
            
            // Status: active, inactive, completed
            $table->enum('status', ['active', 'inactive', 'completed'])->default('inactive');
            
            // Color para identificar visualmente el proyecto (hex)
            $table->string('color', 7)->default('#3B82F6');
            
            // Timestamp de última modificación por usuario
            $table->timestamp('user_modified_at')->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};