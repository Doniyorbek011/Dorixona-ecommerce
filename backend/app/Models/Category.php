<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_uz',
        'name_ru',
        'slug',
        'description',
        'image',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }

    /**
     * Get localized name based on language code.
     */
    public function getNameAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ru' ? ($this->name_ru ?: $this->name_uz) : ($this->name_uz ?: $this->name_ru);
    }

    /**
     * Products belonging to this category.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
