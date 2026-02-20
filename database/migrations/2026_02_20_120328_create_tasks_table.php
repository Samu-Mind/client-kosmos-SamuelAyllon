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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade');
            
            $table->string('name');
            $table->text('description')->nullable();
            
            // Priority: low, medium, high
            $table->enum('priority', ['low', 'medium', 'high'])->default('low');
            
            // Status: pending, completed
            $table->enum('status', ['pending', 'completed'])->default('pending');
            
            // Fecha de vencimiento
            $table->date('due_date')->nullable();
            
            // Fecha de completado
            $table->timestamp('completed_at')->nullable();
            
            // Timestamp de última modificación por usuario
            $table->timestamp('user_modified_at')->nullable();
            
            // Soft deletes para recuperar tareas eliminadas
            $table->softDeletes();
            
            $table->timestamps();
            
            // Índices para consultas rápidas
            $table->index('user_id');
            $table->index('project_id');
            $table->index('status');
            $table->index('priority');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};