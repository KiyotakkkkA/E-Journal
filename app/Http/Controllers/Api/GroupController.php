<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{

    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_groups')) {
            return response()->json(['message' => 'У вас нет прав на создание группы'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:groups',
            'max_students' => 'required|integer|min:1|max:30',
        ]);

        $group = Group::makeCreated($validated);

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

    public function update(Request $request, Group $group)
    {
        if (!Auth::user()->hasPermissionTo('make_groups')) {
            return response()->json(['message' => 'У вас нет прав на редактирование группы'], 403);
        }
        $group->makeUpdated($request->all());
        return response()->json(['group' => $group]);
    }

    public function delete(Group $group)
    {
        if (!Auth::user()->hasPermissionTo('make_groups')) {
            return response()->json(['message' => 'У вас нет прав на удаление группы'], 403);
        }

        $group->deleteTransactions();
        return response()->json(['message' => 'Group deleted successfully']);
    }
}

