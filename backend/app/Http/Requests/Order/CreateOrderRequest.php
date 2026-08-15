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
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:500'],
            'note' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', 'string', 'in:cash,payme,click,uzum,card'],
            'idempotency_key' => ['nullable', 'string', 'max:64'],
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
        ];
    }
}
