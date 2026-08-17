<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isGuest = !auth('sanctum')->check();

        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:500'],
            'note' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', 'string', 'in:cash,payme,click,uzum,card'],
            'idempotency_key' => ['nullable', 'string', 'max:64'],
            'items' => [$isGuest ? 'required' : 'nullable', 'array', $isGuest ? 'min:1' : 'min:0'],
            'items.*.product_id' => ['required_with:items', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required_with:items', 'integer', 'min:1'],
        ];

    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Mijoz ismini kiritish shart.',
            'phone.required' => 'Telefon raqamini kiritish shart.',
            'address.required' => 'Yetkazib berish manzilini kiritish shart.',
            'payment_method.required' => 'To‘lov usulini tanlash shart.',
            'payment_method.in' => 'Noto‘g‘ri to‘lov usuli tanlandi.',
            'items.required' => 'Buyurtma berish uchun savatda kamida bitta mahsulot bo‘lishi shart.',
            'items.min' => 'Buyurtma berish uchun savatda kamida bitta mahsulot bo‘lishi shart.',
            'items.*.product_id.required_with' => 'Mahsulot ID raqami ko‘rsatilmadi.',
            'items.*.product_id.exists' => 'Tanlangan mahsulot tizimda mavjud emas.',
            'items.*.quantity.required_with' => 'Mahsulot miqdori ko‘rsatilmadi.',
            'items.*.quantity.min' => 'Mahsulot miqdori kamida 1 dona bo‘lishi kerak.',
        ];
    }
}
