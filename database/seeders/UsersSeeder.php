<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
            'role_id' => 1
        ]);

        User::create([
            'name' => 'Teacher',
            'email' => 'teacher@teacher.com',
            'password' => Hash::make('teacher123'),
            'role_id' => 2
        ]);

        User::create([
            'name' => 'Student',
            'email' => 'student@student.com',
            'password' => Hash::make('student123'),
            'role_id' => 3
        ]);
    }
}
