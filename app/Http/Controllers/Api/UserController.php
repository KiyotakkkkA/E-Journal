<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\Group;
class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = Auth::user()->load(['role', 'student.group']);

            if (!$user) {
                return response()->json([
                    'message' => 'Пользователь не найден'
                ], 404);
            }

            $userData = [
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'group' => $user->student?->getActiveGroup() ? [
                        'name' => $user->student->getActiveGroup()->name
                    ] : null
                ],
            ];

            return response()->json($userData, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Произошла ошибка при получении данных пользователя',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        return response()->json(['user' => ''], 200);
    }
}
