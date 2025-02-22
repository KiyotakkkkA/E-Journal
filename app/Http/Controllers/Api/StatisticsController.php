<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Group;

class StatisticsController extends Controller
{

    public function getTotalData()
    {
        $user = auth()->user();

        if (!($user->hasPermissionTo('be_student') || $user->hasPermissionTo('be_teacher') || $user->hasPermissionTo('be_admin'))) {
            return response()->json(['error' => 'Unauthorized'], 200);
        }

        $students = Student::count();
        $teachers = Teacher::count();
        $groups = Group::where('is_active', true)->count();
        return response()->json(['students' => $students, 'teachers' => $teachers, 'groups' => $groups]);
    }
}
