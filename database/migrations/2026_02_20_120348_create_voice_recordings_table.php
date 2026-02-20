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
        Schema::create('voice_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Relaciones opcionales con tareas e ideas
            $table->foreignId('task_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('idea_id')->nullable()->constrained()->onDelete('cascade');
            
            // Ruta del archivo de audio
            $table->string('file_path');
            
            // Transcripción del audio (generada por Whisper)
            $table->text('transcription')->nullable();
            
            // Status: pending, processing, completed, failed
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            
            // Duración en segundos
            $table->integer('duration')->nullable();
            
            // Mensaje de error si falla
            $table->text('error_message')->nullable();
            
            $table->timestamps();
            
            // Índices
            $table->index('user_id');
            $table->index('task_id');
            $table->index('idea_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voice_recordings');
    }
};