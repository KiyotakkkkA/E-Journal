<?php

namespace App\GraphQL\Queries;

use App\Models\Group;
use Illuminate\Support\Facades\Auth;

class GroupsQuery
{
    public function resolve($root, array $args)
    {
        $user = Auth::user();

        if ($user->hasPermissionTo('make_groups')) {
            return Group::where('is_active', true)
                ->withCount('students')
                ->get();
        }

        if ($user->hasPermissionTo('be_email_verified')) {
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
