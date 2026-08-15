<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category') ?: $this->route('id');

        return [
            'name_uz' => ['sometimes', 'required', 'string', 'max:255'],
            'name_ru' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($categoryId)],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:1000'],
            'status' => ['nullable', 'boolean'],
        ];
    }
}
