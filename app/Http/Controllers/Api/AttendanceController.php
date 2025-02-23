<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Group;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:groups,id',
            'date' => 'required|date',
        ]);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek;
        $weekNumber = $date->weekOfYear;
        $isEvenWeek = $weekNumber % 2 === 0;

        $query = Schedule::where('group_id', $request->group_id)
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true);

        if (Auth::user()->hasPermissionTo('be_teacher')) {
            $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
            $query->where('teacher_id', $teacher->id);
        }

        $schedules = $query->where(function ($query) use ($isEvenWeek) {
                $query->where('week_type', $isEvenWeek ? 'even' : 'odd')
                      ->orWhere('week_type', 'all');
            })
            ->with(['lesson.discipline', 'teacher.user'])
            ->orderBy('start_time')
            ->get();

        if ($schedules->isEmpty()) {
            return response()->json([
                'lessons' => [],
                'students' => [],
                'data' => [],
            ]);
        }

        $students = Student::where('group_id', $request->group_id)
            ->with('user:id,name')
            ->join('users', 'students.user_id', '=', 'users.id')
            ->orderBy('users.name')
            ->select('students.*')
            ->get()
            ->values()
            ->map(function ($student, $index) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'number' => $index + 1,
                ];
            });

        $attendanceRecords = Attendance::where('date', $date->format('Y-m-d'))
            ->whereIn('student_id', $students->pluck('id'))
            ->whereIn('schedule_id', $schedules->pluck('id'))
            ->get();

        $lessons = $schedules->map(function ($schedule) {
            return [
                'id' => $schedule->id,
                'discipline' => [
                    'name' => $schedule->lesson->discipline->name,
                ],
                'time' => $schedule->start_time . ' - ' . $schedule->end_time,
                'teacher' => $schedule->teacher->user->name,
                'week_type' => $schedule->week_type,
                'type' => $schedule->lesson->type,
            ];
        });

        $attendanceData = $attendanceRecords->map(function ($record) {
            return [
                'student_id' => $record->student_id,
                'lesson_id' => $record->schedule_id,
                'status' => $record->status,
            ];
        });

        return response()->json([
            'lessons' => $lessons,
            'students' => $students,
            'data' => $attendanceData,
        ]);
    }

    public function store(Request $request)
    {
        if (Auth::user()->hasPermissionTo('be_teacher')) {
            $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
            $schedule = Schedule::where('id', $request->lesson_id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$schedule) {
                return response()->json(['message' => 'Not enough rights'], 403);
            }
        }

        elseif (!Auth::user()->hasPermissionTo('make_attendance')) {
            return response()->json(['message' => 'Not enough rights'], 403);
        }

        $request->validate([
            'student_id' => 'required|exists:students,id',
            'lesson_id' => 'required|exists:schedules,id',
            'status' => 'required|in:present,absent,late,excused',
            'date' => 'required|date',
        ]);

        Attendance::updateOrCreate(
            [
                'student_id' => $request->student_id,
                'schedule_id' => $request->lesson_id,
                'date' => $request->date,
            ],
            ['status' => $request->status]
        );

        return response()->json(['message' => 'Attendance updated']);
    }

    public function getStudentAttendance(Request $request)
    {
        $student = Student::where('user_id', Auth::id())->firstOrFail();

        $attendance = Attendance::where('student_id', $student->id)
            ->with(['schedule.lesson.discipline'])
            ->whereBetween('date', [
                $request->get('start_date', Carbon::now()->startOfMonth()),
                $request->get('end_date', Carbon::now()->endOfMonth()),
            ])
            ->get()
            ->groupBy('date');

        return response()->json($attendance);
    }

    public function confirmAttendance(Request $request)
    {
        $request->validate([
            'lesson_id' => 'required|exists:schedules,id',
            'date' => 'required|date',
        ]);

        if (Auth::user()->hasPermissionTo('be_teacher')) {
            $teacher = Teacher::where('user_id', Auth::id())->firstOrFail();
            $schedule = Schedule::where('id', $request->lesson_id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$schedule) {
                return response()->json(['message' => 'Not enough rights'], 403);
            }
        } elseif (!Auth::user()->hasPermissionTo('make_attendance')) {
            return response()->json(['message' => 'Not enough rights'], 403);
        }

        return response()->json(['message' => 'Attendance confirmed']);
    }
}
