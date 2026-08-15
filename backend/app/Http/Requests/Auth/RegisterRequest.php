<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:25', 'unique:users,phone'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'address' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Foydalanuvchi ismini kiritish shart.',
            'phone.required' => 'Telefon raqamini kiritish shart.',
            'phone.unique' => 'Bu telefon raqami allaqachon ro‘yxatdan o‘tgan.',
            'email.required' => 'Email manzilini kiritish shart.',
            'email.email' => 'Yaroqli email manzilini kiriting.',
            'email.unique' => 'Bu email manzili allaqachon ro‘yxatdan o‘tgan.',
            'password.required' => 'Parolni kiritish shart.',
            'password.min' => 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak.',
            'password.confirmed' => 'Parolni tasdiqlash mos kelmadi.',
        ];
    }
}
