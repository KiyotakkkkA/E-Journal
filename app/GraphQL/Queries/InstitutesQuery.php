<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Institute;

final readonly class InstitutesQuery
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // TODO implement the resolver
    }

    public function resolve()
    {
        return Institute::where('is_active', true)->withCount('cafedras as count_cafedras')->get();
    }
}
