<?php

namespace App\GraphQL\Loaders;

use App\Models\Group;
use App\Models\Student;
use Nuwave\Lighthouse\Execution\DataLoader\BatchLoader;

class GroupStudentsLoader extends BatchLoader
{
    public function resolve(): array
    {
        $groupIds = collect($this->keys);

        $students = Student::whereIn('group_id', $groupIds)
            ->join('users', 'students.user_id', '=', 'users.id')
            ->select('users.id', 'users.name', 'users.email', 'students.group_id')
            ->get()
            ->groupBy('group_id')
            ->map(function ($groupStudents) {
                return $groupStudents->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'name' => $student->name,
                        'email' => $student->email,
                    ];
                })->values()->all();
            });

        return $groupIds->mapWithKeys(function ($id) use ($students) {
            return [$id => $students->get($id, collect([]))->all()];
        })->all();
    }
}
