<?php

namespace App\Http\Requests\Cart;

use Illuminate\Foundation\Http\FormRequest;

class AddToCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Mahsulot tanlanishi shart.',
            'product_id.exists' => 'Bunday mahsulot mavjud emas.',
            'quantity.min' => 'Kamida 1 dona mahsulot qo‘shilishi kerak.',
        ];
    }
}
