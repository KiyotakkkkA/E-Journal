<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Group;
use Carbon\Carbon;
use App\Models\Schedule;
use Illuminate\Support\Facades\Log;

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
        $lessons = Schedule::where('day_of_week', strtolower(Carbon::now()->locale('en')->isoFormat('dddd')))->count();

        return response()->json(['students' => $students, 'teachers' => $teachers, 'groups' => $groups, 'lessons' => $lessons]);
    }
}
