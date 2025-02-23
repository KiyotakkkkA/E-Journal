<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|string|min:8',
            'agree' => 'required|accepted',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => "Неверный формат данных"], 400);
        }

        if ($request->password !== $request->password_confirmation) {
            return response()->json(['errors' => 'Пароли не совпадают'], 400);
        }

        $user = User::create([
            'name' => "Неизвестный",
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 5,
        ]);

        Auth::attempt($request->only('email', 'password'), true);

        $request->session()->regenerate();

        return response()->json(['message' => 'User created successfully'], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
            'remember' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => "Неверная почта или пароль"], 400);
        }

        $remember = $request->boolean('remember', false);

        if (!Auth::attempt($request->only('email', 'password'), $remember)) {
            return response()->json(['errors' => 'Неверная почта или пароль'], 401);
        }

        $request->session()->regenerate();

        return response()->json(['message' => 'Login successful'], 200);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();


        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function checkAuth(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $canViewAdminPanel = $user->hasPermissionTo('view_admin_panel');
            $student = $user->student;
            $isInGroup = false;
            $group = null;
            if ($student) {
                $isInGroup = $student->getActiveGroup() !== null;
                $group = $student->getActiveGroup();
            }

            return response()->json([
                'message' => 'User is authenticated', 'isAuthenticated' => true,
                'canViewAdminPanel' => $canViewAdminPanel,
                'isInGroup' => $isInGroup,
                'hasVerifiedEmail' => $user->hasEmailVerified(),
                'group' => $group,
                'roles' => [
                    'isStudent' => $user->isStudent(),
                    'isTeacher' => $user->isTeacher(),
                    'isAdmin' => $user->isAdmin(),
                    'isEmailVerified' => $user->isEmailVerified(),
                    'isGuest' => $user->isGuest()
                ],
            ], 200);
        }
    }
}
