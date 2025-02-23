<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Lesson;
use App\Models\Teacher;
use Illuminate\Support\Facades\Log;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Schedule::with(['group', 'teacher.user', 'lesson.discipline', 'auditorium'])
            ->where('is_active', true);

        if ($request->week_type !== 'all') {
            $query->where('week_type', $request->week_type);
        }

        if ($user->isTeacher()) {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if (!$teacher) {
                return response()->json([], 200);
            }
            $query->where('teacher_id', $teacher->id);
        } else {
            if (!$request->group_id) {
                return response()->json([], 200);
            }
            $query->where('group_id', $request->group_id);

            if ($request->day_of_week && $request->day_of_week !== 'all') {
                $query->where('day_of_week', $request->day_of_week);
            }
        }

        $schedules = $query->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_schedule')) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'teacher_id' => 'required|exists:teachers,user_id',
            'type' => 'required|in:lecture,practice,laboratory,seminar',
            'discipline_id' => 'required|exists:disciplines,id',
            'auditorium_id' => 'required|exists:auditoriums,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'week_type' => 'required|in:all,even,odd',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time'
        ]);

        // Проверяем конфликт с парами на все недели
        $allWeekConflict = Schedule::where('day_of_week', $validated['day_of_week'])
            ->where('week_type', 'all')
            ->where('is_active', true)
            ->where(function ($query) use ($validated) {
                $query->where(function ($q) use ($validated) {
                    $q->where('start_time', '<=', $validated['start_time'])
                        ->where('end_time', '>', $validated['start_time']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('start_time', '<', $validated['end_time'])
                        ->where('end_time', '>=', $validated['end_time']);
                });
            })
            ->where(function ($query) use ($validated) {
                $query->where('group_id', $validated['group_id'])
                    ->orWhere('teacher_id', $validated['teacher_id'])
                    ->orWhere('auditorium_id', $validated['auditorium_id']);
            })
            ->exists();

        if ($allWeekConflict) {
            return response()->json([
                'message' => 'Конфликт с занятием, назначенным на все недели'
            ], 422);
        }

        $teacher = Teacher::where('user_id', $validated['teacher_id'])->first();

        $lesson = Lesson::where('type', $validated['type'])
            ->where('discipline_id', $validated['discipline_id'])
            ->where('teacher_id', $teacher->id)
            ->first();

        $conflicts = Schedule::where('day_of_week', $validated['day_of_week'])
            ->where('week_type', $validated['week_type'])
            ->where('is_active', true)
            ->where(function ($query) use ($validated) {
                $query->where(function ($q) use ($validated) {
                    $q->where('start_time', '<=', $validated['start_time'])
                        ->where('end_time', '>', $validated['start_time']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('start_time', '<', $validated['end_time'])
                        ->where('end_time', '>=', $validated['end_time']);
                });
            })
            ->where(function ($query) use ($validated) {
                $query->where('group_id', $validated['group_id'])
                    ->orWhere('teacher_id', $validated['teacher_id'])
                    ->orWhere('auditorium_id', $validated['auditorium_id']);
            })
            ->exists();

        if ($conflicts) {
            return response()->json([
                'message' => 'Conflict with other lessons'
            ], 422);
        }

        $dataToCreate = [
            "group_id" => $validated['group_id'],
            "teacher_id" => $teacher->id,
            "lesson_id" => $lesson->id,
            "auditorium_id" => $validated['auditorium_id'],
            "day_of_week" => $validated['day_of_week'],
            "week_type" => $validated['week_type'],
            "start_time" => $validated['start_time'],
            "end_time" => $validated['end_time'],
        ];

        $schedule = Schedule::create($dataToCreate);

        return response()->json(
            $schedule->load(['group', 'teacher.user', 'lesson.discipline', 'auditorium']),
            201
        );
    }

    public function update(Request $request, Schedule $schedule)
    {
        if (!Auth::user()->hasPermissionTo('make_schedule')) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'teacher_id' => 'required|exists:teachers,user_id',
            'type' => 'required|in:lecture,practice,laboratory,seminar',
            'discipline_id' => 'required|exists:disciplines,id',
            'auditorium_id' => 'required|exists:auditoriums,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday',
            'week_type' => 'required|in:all,even,odd',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time'
        ]);

        // Проверяем конфликт с парами на все недели, исключая текущую запись
        $allWeekConflict = Schedule::where('id', '!=', $schedule->id)
            ->where('day_of_week', $validated['day_of_week'])
            ->where('week_type', 'all')
            ->where('is_active', true)
            ->where(function ($query) use ($validated) {
                $query->where(function ($q) use ($validated) {
                    $q->where('start_time', '<=', $validated['start_time'])
                        ->where('end_time', '>', $validated['start_time']);
                })->orWhere(function ($q) use ($validated) {
                    $q->where('start_time', '<', $validated['end_time'])
                        ->where('end_time', '>=', $validated['end_time']);
                });
            })
            ->where(function ($query) use ($validated) {
                $query->where('group_id', $validated['group_id'])
                    ->orWhere('teacher_id', $validated['teacher_id'])
                    ->orWhere('auditorium_id', $validated['auditorium_id']);
            })
            ->exists();

        if ($allWeekConflict) {
            return response()->json([
                'message' => 'Конфликт с занятием, назначенным на все недели'
            ], 422);
        }

        $teacher = Teacher::where('user_id', $validated['teacher_id'])->first();

        $lesson = Lesson::where('type', $validated['type'])
            ->where('discipline_id', $validated['discipline_id'])
            ->where('teacher_id', $teacher->id)
            ->first();

        $dataToUpdate = [
            "group_id" => $validated['group_id'],
            "teacher_id" => $teacher->id,
            "lesson_id" => $lesson->id,
            "auditorium_id" => $validated['auditorium_id'],
            "day_of_week" => $validated['day_of_week'],
            "week_type" => $validated['week_type'],
            "start_time" => $validated['start_time'],
            "end_time" => $validated['end_time'],
        ];

        $schedule->update($dataToUpdate);

        return response()->json(
            $schedule->load(['group', 'teacher.user', 'lesson.discipline', 'auditorium'])
        );
    }

    public function destroy(Schedule $schedule)
    {
        if (!Auth::user()->hasPermissionTo('make_schedule')) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $schedule->update(['is_active' => false]);

        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}
