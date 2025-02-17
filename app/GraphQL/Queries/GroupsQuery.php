<?php

namespace App\GraphQL\Queries;

use App\Models\Group;

class GroupsQuery
{
    public function resolve()
    {
        return Group::where('is_active', true)
                   ->withCount('students')
                   ->get();
    }
}
