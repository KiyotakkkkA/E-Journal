<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function index()
    {
        $query = User::select([
            'roles.name as role_name',
            'users.id',
            'users.email',
            'users.email_verified_at',
            'users.name',
            'teachers.id as teacher_id'
        ])
        ->join('roles', 'users.role_id', '=', 'roles.id')
        ->leftJoin('teachers', 'users.id', '=', 'teachers.user_id')
        ->where('roles.name', 'Преподаватель')
        ->with(['teacher.lessons' => function($query) {
            $query->select('id', 'teacher_id', 'discipline_id', 'type')
                ->with('discipline:id,name,code');
        }]);

        return $query->get()->map(function($user) {
            return [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'email_verified_at' => $user->email_verified_at,
                'disciplines' => $user->teacher ? $user->teacher->lessons
                    ->groupBy('discipline_id')
                    ->map(function($lessons) {
                        $discipline = $lessons->first()->discipline;
                        return [
                            'id' => $discipline->id,
                            'name' => $discipline->name,
                            'code' => $discipline->code,
                            'types' => $lessons->pluck('type')->toArray()
                        ];
                    })->values()
                    : []
            ];
        });
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
