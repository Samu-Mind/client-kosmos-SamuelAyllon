<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiConversation extends Model
{
    use HasFactory;

    public $timestamps = false; // Solo usamos created_at

    protected $fillable = [
        'user_id',
        'role',
        'message',
        'metadata',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'created_at' => 'datetime',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario de la conversación
     */
    public function user()
    {
        return $this->belongsTo(User::class);
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
     * Filtrar mensajes del usuario
     */
    public function scopeUserMessages($query)
    {
        return $query->where('role', 'user');
    }

    /**
     * Filtrar respuestas del asistente
     */
    public function scopeAssistantMessages($query)
    {
        return $query->where('role', 'assistant');
    }

    /**
     * Obtener conversaciones recientes
     */
    public function scopeRecent($query, int $limit = 10)
    {
        return $query->latest('created_at')->limit($limit);
    }

    // ==================== MÉTODOS ESTÁTICOS ====================

    /**
     * Obtener historial de conversación del usuario
     */
    public static function getConversationHistory(User $user, int $limit = 50): array
    {
        return self::forUser($user)
            ->orderBy('created_at', 'asc')
            ->limit($limit)
            ->get()
            ->map(fn($msg) => [
                'role' => $msg->role,
                'content' => $msg->message,
                'created_at' => $msg->created_at->toIso8601String(),
            ])
            ->toArray();
    }

    /**
     * Agregar mensaje del usuario
     */
    public static function addUserMessage(User $user, string $message, ?array $metadata = null): self
    {
        return self::create([
            'user_id' => $user->id,
            'role' => 'user',
            'message' => $message,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }

    /**
     * Agregar respuesta del asistente
     */
    public static function addAssistantMessage(User $user, string $message, ?array $metadata = null): self
    {
        return self::create([
            'user_id' => $user->id,
            'role' => 'assistant',
            'message' => $message,
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Verificar si es mensaje del usuario
     */
    public function isUserMessage(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Verificar si es mensaje del asistente
     */
    public function isAssistantMessage(): bool
    {
        return $this->role === 'assistant';
    }
}