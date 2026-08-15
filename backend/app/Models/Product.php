<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'discount_price',
        'brand',
        'stock',
        'image',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_price' => 'decimal:2',
            'stock' => 'integer',
            'status' => 'boolean',
        ];
    }

    /**
     * Category the product belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Cart items referencing this product.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Order items referencing this product.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Effective current price (with discount if applicable).
     */
    public function getFinalPriceAttribute(): float
    {
        return (float) ($this->discount_price !== null && $this->discount_price > 0 && $this->discount_price < $this->price
            ? $this->discount_price
            : $this->price);
    }

    /**
     * Check if product is in stock.
     */
    public function getInStockAttribute(): bool
    {
        return $this->stock > 0;
    }
}
