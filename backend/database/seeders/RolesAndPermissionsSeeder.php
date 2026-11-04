<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'settings.general.update',
            'settings.mail.update',
            'roles.manage',
            'users.manage',
            'students.view',
            'students.create',
            'students.update',
            'students.delete',
            'grade.submit',
            'grade.approve',
            'grade.publish',
            'workflow.configure',
            'report_card.design',
            'report_card.generate',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        $roles = [
            'Admin'           => ['settings.general.update', 'settings.mail.update', 'roles.manage', 'users.manage', 'students.view', 'students.create', 'students.update', 'students.delete', 'grade.publish', 'workflow.configure', 'report_card.design', 'report_card.generate'],
            'Headteacher'     => ['students.view', 'grade.approve', 'grade.publish', 'report_card.generate'],
            'HOD'             => ['students.view', 'grade.approve'],
            'Class Teacher'   => ['students.view', 'grade.submit', 'grade.approve'],
            'Subject Teacher' => ['students.view', 'grade.submit'],
        ];

        foreach ($roles as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($perms);
        }
    }
}