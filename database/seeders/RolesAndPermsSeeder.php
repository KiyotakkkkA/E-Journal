<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $rolesArray = [
            [
                'name' => 'Администратор',
                'permissions' => ['view_admin_panel', 'make_schedule', 'make_users', 'view_all_schedule', 'view_all_groups', 'view_all_groups_history']
            ],
            [
                'name' => 'Преподаватель',
                'permissions' => ['view_all_schedule', 'make_attendance', 'view_all_groups']
            ],
            [
                'name' => 'Студент',
                'permissions' => ['view_self_schedule', 'view_group_history']
            ]
        ];

        $permissionsArray = [
            [
                'name' => 'view_self_schedule',
                'description' => 'Может просматривать расписание и посещаемость своей группы'
            ],
            [
                'name' => 'view_all_schedule',
                'description' => 'Может просматривать все расписание и посещаемость всех групп'
            ],
            [
                'name' => 'view_all_groups',
                'description' => 'Может просматривать все группы'
            ],
            [
                'name' => 'view_group_history',
                'description' => 'Может просматривать историю группы'
            ],
            [
                'name' => 'view_all_groups_history',
                'description' => 'Может просматривать историю всех групп'
            ],
            [
                'name' => 'view_admin_panel',
                'description' => 'Может просматривать админ панель'
            ],
            [
                'name' => 'make_attendance',
                'description' => 'Может отмечать посещение занятий'
            ],
            [
                'name' => 'make_schedule',
                'description' => 'Может создавать и редактировать расписание'
            ],
            [
                'name' => 'make_users',
                'description' => 'Может создавать и редактировать пользователей'
            ],

        ];
        foreach ($permissionsArray as $permission) {
            Permission::create(['name' => $permission['name'], 'description' => $permission['description']]);
        }

        foreach ($rolesArray as $role) {
            $roleModel = Role::create(['name' => $role['name']]);
            foreach ($role['permissions'] as $permission) {
                $roleModel->permissions()->attach(Permission::where('name', $permission)->first()->id);
            }
        }

    }
}
