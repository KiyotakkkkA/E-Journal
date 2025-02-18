<?php

namespace App\GraphQL\Queries;

use App\Models\GroupHistory;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class GroupHistoryQuery
{
    public function resolve($root, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        return GroupHistory::where('group_id', $args['group_id'])->get();
    }
}
