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
        $students = Student::count();
        $teachers = Teacher::count();
        $groups = Group::where('is_active', true)->count();
        return response()->json(['students' => $students, 'teachers' => $teachers, 'groups' => $groups]);
    }
}
