<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VoiceRecording extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'task_id',
        'idea_id',
        'file_path',
        'transcription',
        'status',
        'duration',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'duration' => 'integer',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario de la grabación
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener la tarea relacionada (nullable)
     */
    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Obtener la idea relacionada (nullable)
     */
    public function idea()
    {
        return $this->belongsTo(Idea::class);
    }

    // ==================== SCOPES ====================

    /**
     * Filtrar por usuario
     */
    public function scopeForUser($query, User $user)
    {
        return $query->where('user_id', $user->id);
    }

    /**
     * Filtrar grabaciones pendientes
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Filtrar grabaciones en proceso
     */
    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    /**
     * Filtrar grabaciones completadas
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Filtrar grabaciones fallidas
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Marcar como en proceso
     */
    public function markAsProcessing(): void
    {
        $this->update([
            'status' => 'processing',
            'error_message' => null,
        ]);
    }

    /**
     * Marcar como completada con transcripción
     */
    public function markAsCompleted(string $transcription, ?int $duration = null): void
    {
        $this->update([
            'status' => 'completed',
            'transcription' => $transcription,
            'duration' => $duration,
            'error_message' => null,
        ]);
    }

    /**
     * Marcar como fallida con error
     */
    public function markAsFailed(string $errorMessage): void
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $errorMessage,
        ]);
    }

    /**
     * Verificar si está pendiente
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Verificar si está procesando
     */
    public function isProcessing(): bool
    {
        return $this->status === 'processing';
    }

    /**
     * Verificar si está completada
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Verificar si falló
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Obtener label del estado
     */
    public function getStatusLabel(): string
    {
        return match($this->status) {
            'pending' => 'Pendiente',
            'processing' => 'Procesando',
            'completed' => 'Completada',
            'failed' => 'Fallida',
            default => 'Desconocido',
        };
    }

    /**
     * Obtener duración formateada
     */
    public function getFormattedDuration(): ?string
    {
        if ($this->duration === null) {
            return null;
        }

        $minutes = floor($this->duration / 60);
        $seconds = $this->duration % 60;

        return sprintf('%02d:%02d', $minutes, $seconds);
    }

    /**
     * Verificar si tiene transcripción
     */
    public function hasTranscription(): bool
    {
        return !empty($this->transcription);
    }
}