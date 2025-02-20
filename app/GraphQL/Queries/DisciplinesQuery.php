<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Discipline;

final readonly class DisciplinesQuery
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // TODO implement the resolver
    }

    public function resolve()
    {
        return Discipline::all();
    }
}
