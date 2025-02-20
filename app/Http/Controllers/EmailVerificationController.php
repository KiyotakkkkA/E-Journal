<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Mail\EmailVerification;
use Carbon\Carbon;

class EmailVerificationController extends Controller
{
    public function sendVerificationEmail(Request $request)
    {
        try {
            $user = $request->user();

            if ($user->email_verified_at) {
                return response()->json([
                    'message' => 'Email уже подтвержден'
                ], 400);
            }

            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            $cacheKey = 'email_verification_' . $user->id;
            Cache::put($cacheKey, $code, Carbon::now()->addHour());

            Mail::to($user->email)->send(new EmailVerification([
                'code' => $code,
                'verificationUrl' => config('app.url') . '/verify-email?code=' . $code,
            ]));

            return response()->json([
                'message' => 'Код подтверждения отправлен на вашу почту'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Не удалось отправить код подтверждения'
            ], 500);
        }
    }

    public function verify(Request $request)
    {
        try {
            $request->validate([
                'code' => 'required|string|size:6'
            ]);

            $user = $request->user();
            $cacheKey = 'email_verification_' . $user->id;

            $savedCode = Cache::get($cacheKey);

            if (!$savedCode) {
                return response()->json([
                    'message' => 'Код подтверждения истек. Запросите новый код.'
                ], 400);
            }

            if ($savedCode !== $request->code) {
                return response()->json([
                    'message' => 'Неверный код подтверждения'
                ], 400);
            }

            $user->email_verified_at = now();
            $user->save();

            Cache::forget($cacheKey);

            if (!$user->hasPermissionTo('be_teacher')) {
                $user->role_id = 4;
                $user->save();
            }

            return response()->json([
                'message' => 'Email успешно подтвержден'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Не удалось подтвердить email'
            ], 500);
        }
    }
}
