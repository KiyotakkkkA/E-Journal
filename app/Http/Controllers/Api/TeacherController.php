<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function index(Request $request)
    {

        $state = $request->query('verified');

        $query = User::select(['roles.name', 'users.id', 'users.email', 'users.email_verified_at', 'users.name'])
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.name', 'Преподаватель');

        if ($state === 'true') {
            $query->where('users.email_verified_at', '!=', null);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole('Преподаватель');

        return response()->json($user, 201);
    }

    public function destroy(User $teacher)
    {
        $teacher->delete();
        return response()->json(['message' => 'Teacher deleted successfully']);
    }

    public function update(User $teacher, Request $request)
    {
        $teacher->update($request->all());
        return response()->json(['message' => 'Teacher updated successfully']);
    }
}
