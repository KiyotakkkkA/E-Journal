<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\FieldResolver;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use App\GraphQL\Loaders\GroupStudentsLoader;

class CanViewStudentsDirective extends BaseDirective implements FieldResolver
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Check if user can view students.
"""
directive @canViewStudents on FIELD_DEFINITION
GRAPHQL;
    }

    public function resolveField(FieldValue $fieldValue): callable
    {
        return function ($root, array $args, $context, $resolveInfo) {
            try {
                $user = Auth::guard('web')->user();

                if (!$user || $user->hasPermissionTo('make_groups')) {
                    return [];
                }

                return $user->student->group->students()
                    ->join('users', 'students.user_id', '=', 'users.id')
                    ->select('users.id', 'users.name', 'users.email')
                    ->get();

            } catch (\Exception $e) {
                \Log::error('Error in CanViewStudentsDirective: ' . $e->getMessage());
                return [];
            }
        };
    }
}
