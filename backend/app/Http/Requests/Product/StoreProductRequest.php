<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'brand' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999999'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock' => ['required', 'integer', 'min:0', 'max:999999'],
            'image' => ['nullable', 'string', 'max:1000'],
            'image_file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp', 'max:5120'], // Max 5MB
            'status' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategoriya tanlanishi shart.',
            'category_id.exists' => 'Tanlangan kategoriya mavjud emas.',
            'name.required' => 'Mahsulot nomini kiritish shart.',
            'brand.required' => 'Brend nomini kiritish shart.',
            'price.required' => 'Mahsulot narxini kiritish shart.',
            'discount_price.lt' => 'Chegirma narxi asosiy narxdan kam bo‘lishi lozim.',
            'image_file.mimes' => 'Faqat JPG, PNG, WEBP formatdagi rasmlar qabul qilinadi.',
            'image_file.max' => 'Rasm hajmi 5MB dan oshmasligi lozim.',
        ];
    }
}
