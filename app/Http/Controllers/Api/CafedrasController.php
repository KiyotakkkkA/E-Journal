<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Cafedra;
use App\Models\Teacher;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CafedrasController extends Controller
{

    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на создание кафедры'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'institute_id' => 'required|exists:institutes,id',
        ]);

        $cafedra = Cafedra::create($validated);

        return response()->json($cafedra, 201);
    }

    public function destroy(Cafedra $cafedra)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на удаление кафедры'], 403);
        }

        $cafedra->makeDeleted();
        return response()->json(['message' => 'Cafedra deleted successfully']);
    }

    public function update(Cafedra $cafedra, Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на обновление кафедры'], 403);
        }

        $cafedra->update($request->all());
        return response()->json(['message' => 'Cafedra updated successfully']);
    }

    public function assignTeachers(Cafedra $cafedra, Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на назначение преподавателей'], 403);
        }

        $teachers = $request['teachers'];

        foreach ($teachers as $teacher) {
            $person = Teacher::where('user_id', $teacher['id'])->first();
            $person->cafedra_id = $cafedra->id;
            $person->save();
        }

        return response()->json([
            'message' => 'Teachers assigned successfully'
        ]);
    }

    public function getCafedraTeachers(Cafedra $cafedra)
    {
        $teachers = Teacher::select('users.*', 'teachers.cafedra_id', 'teachers.user_id')
        ->where('cafedra_id', $cafedra->id)
        ->join('users', 'teachers.user_id', '=', 'users.id')
        ->get()->toArray();
        return response()->json($teachers);
    }

    public function removeTeacher(Cafedra $cafedra, Request $request)
    {
        $teacher = Teacher::where('user_id', $request->teacherId)->first();
        $teacher->cafedra_id = null;
        $teacher->save();
        return response()->json(['message' => 'Teacher removed successfully']);
    }
}
