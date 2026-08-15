<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'exists:users,email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email manzilini kiritish shart.',
            'token.required' => 'Tiklash kodi yoki tokeni kiritilishi shart.',
            'password.required' => 'Yangi parolni kiritish shart.',
            'password.min' => 'Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak.',
            'password.confirmed' => 'Parolni tasdiqlash mos kelmadi.',
        ];
    }
}
