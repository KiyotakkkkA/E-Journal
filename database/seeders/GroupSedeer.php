<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Group;
class GroupSedeer extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Group::create([
            'name' => 'Группа 1',
            'max_students' => 10,
            'students_count' => 0,
        ]);
        Group::create([
            'name' => 'Группа 2',
            'max_students' => 20,
            'students_count' => 0,
        ]);
        Group::create([
            'name' => 'Группа 3',
            'max_students' => 30,
            'students_count' => 0,
        ]);
    }
}
