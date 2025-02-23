<?php

namespace App\GraphQL\Queries;

use App\Models\Group;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;

class GroupsQuery
{
    public function resolve($root, array $args)
    {
        $user = Auth::user();

        if ($user->hasPermissionTo('be_teacher')) {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();
            return Group::where('is_active', true)
                ->withCount('students')
                ->whereHas('schedules', function ($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->get();
        }

        if ($user->hasPermissionTo('make_groups')) {
            return Group::where('is_active', true)
                ->withCount('students')
                ->get();
        }

        if ($user->hasPermissionTo('be_email_verified') || $user->student->getActiveGroup() === null) {
            return Group::where('is_active', true)
                ->withCount('students')
                ->whereRaw('students_count < max_students')
                ->get();
        }

        if ($user->hasPermissionTo('view_group_history')) {
            return collect([
                Group::where('id', $user->student->group_id)
                    ->withCount('students')
                    ->first()
            ]);
        }

        return collect([]);
    }
}
