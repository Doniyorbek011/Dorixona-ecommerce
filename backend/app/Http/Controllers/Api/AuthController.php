<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Register a new user and generate a Sanctum token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'role' => 'user',
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Ro‘yxatdan muvaffaqiyatli o‘tdingiz!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'role' => $user->role,
            ],
            'token' => $token,
        ], Response::HTTP_CREATED);
    }

    /**
     * Authenticate a user via email or phone and return token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $loginInput = $request->login;

        // Support login by email OR phone
        $user = User::where('email', $loginInput)
            ->orWhere('phone', $loginInput)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Telefon raqami / email yoki parol noto‘g‘ri kiritildi.',
                'errors' => [
                    'login' => ['Kiritilgan ma’lumotlar tizimdagi yozuvlarga mos kelmadi.'],
                ],
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Revoke existing tokens for a clean session if needed or create new
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Tizimga muvaffaqiyatli kirdingiz!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'role' => $user->role,
            ],
            'token' => $token,
        ], Response::HTTP_OK);
    }

    /**
     * Log out the authenticated user (revoke current token).
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tizimdan muvaffaqiyatli chiqildi.',
        ], Response::HTTP_OK);
    }

    /**
     * Get the currently authenticated user's profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->loadCount(['orders', 'cartItems']);

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'role' => $user->role,
                'orders_count' => $user->orders_count,
                'cart_items_count' => $user->cart_items_count,
                'created_at' => $user->created_at,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Update user profile information or password.
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        // Check password change if requested
        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Joriy parol noto‘g‘ri kiritildi.',
                    'errors' => [
                        'current_password' => ['Joriy parol xato.'],
                    ],
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user->password = Hash::make($request->new_password);
        }

        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->email = $request->email;
        $user->address = $request->address;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profilingiz muvaffaqiyatli yangilandi!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'role' => $user->role,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Initiate password reset by generating a reset token.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $token = Str::random(32);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Parolni tiklash ko‘rsatmalari emailingizga yuborildi.',
            // Provided in response for easy development testing
            'dev_reset_token' => $token,
            'dev_email' => $request->email,
        ], Response::HTTP_OK);
    }

    /**
     * Reset password using the verification token.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tiklash kodi yaroqsiz yoki muddati o‘tgan.',
                'errors' => [
                    'token' => ['Tiklash kodi noto‘g‘ri.'],
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Foydalanuvchi topilmadi.',
            ], Response::HTTP_NOT_FOUND);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Delete used token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Parolingiz muvaffaqiyatli yangilandi. Yangi parol bilan tizimga kiring.',
        ], Response::HTTP_OK);
    }
}
