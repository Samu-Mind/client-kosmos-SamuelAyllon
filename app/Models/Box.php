<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Box extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'category',
        'user_modified_at',
    ];

    protected function casts(): array
    {
        return [
            'user_modified_at' => 'datetime',
        ];
    }

    // ==================== RELACIONES ====================

    /**
     * Obtener el usuario de la caja
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener los recursos de la caja
     */
    public function resources()
    {
        return $this->hasMany(Resource::class);
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
     * Filtrar por categoría
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    // ==================== MÉTODOS HELPER ====================

    /**
     * Obtener el número de recursos en la caja
     */
    public function getResourcesCount(): int
    {
        return $this->resources()->count();
    }

    /**
     * Obtener recursos por tipo
     */
    public function getResourcesByType(): array
    {
        return [
            'link' => $this->resources()->where('type', 'link')->count(),
            'document' => $this->resources()->where('type', 'document')->count(),
            'video' => $this->resources()->where('type', 'video')->count(),
            'image' => $this->resources()->where('type', 'image')->count(),
            'other' => $this->resources()->where('type', 'other')->count(),
        ];
    }
}