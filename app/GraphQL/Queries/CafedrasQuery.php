<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Cafedra;

final readonly class CafedrasQuery
{
    public function resolve($root, array $args)
    {
        $query = Cafedra::query();

        if (isset($args['institute_id']) && $args['institute_id'] !== null) {
            $query->where('institute_id', $args['institute_id']);
        }

        return $query->where('is_active', true)->withCount('teachers as count_teachers')->get();
    }
}
