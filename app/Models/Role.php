<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permissions_to_roles');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function givePermissionTo(Permission $permission)
    {
        return $this->permissions()->attach($permission);
    }

    public function hasPermissionTo(String $permissionName)
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }
}
