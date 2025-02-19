<?php

namespace App\GraphQL\Queries;

use App\Models\GroupHistory;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;
use Illuminate\Support\Facades\Auth;

class GroupHistoryQuery
{
    public function resolve($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $user = Auth::user();
        if ($user->hasPermissionTo('view_group_history')) {
            return GroupHistory::where('group_id', $user->student->group_id)->get();
        }

        return [];
    }
}
