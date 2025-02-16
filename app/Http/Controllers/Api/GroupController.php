<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;

class GroupController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:groups',
            'max_students' => 'required|integer|min:1|max:30',
        ]);

        $group = Group::create($validated);

        return response()->json(['group' => $group], 201);
    }

    public function getStudents(Request $request)
    {
        $group = Group::findOrFail($request->query('group_id'));
        $students = $group->students()
            ->join('users', 'students.user_id', '=', 'users.id')
            ->with('user')
            ->orderBy('users.name', 'asc')
            ->select('students.*')
            ->get();

        return response()->json(['students' => $students]);
    }
}
