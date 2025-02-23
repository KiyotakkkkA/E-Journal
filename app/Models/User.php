<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'last_seen',
        'is_online',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function hasPermissionTo(String $permissionName)
    {
        return $this->role->hasPermissionTo($permissionName);
    }

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function studentRequests()
    {
        return $this->hasOne(StudentRequests::class, 'user_id');
    }

    public function isAdmin()
    {
        return $this->hasPermissionTo('be_admin');
    }

    public function isTeacher()
    {
        return $this->hasPermissionTo('be_teacher');
    }

    public function isStudent()
    {
        return $this->hasPermissionTo('be_student');
    }

    public function isEmailVerified()
    {
        return $this->hasPermissionTo('be_email_verified');
    }

    public function isGuest()
    {
        return $this->hasPermissionTo('be_guest');
    }

    public function assignRole(String $roleName)
    {
        $this->role()->associate(Role::where('name', $roleName)->first());
        $this->save();
    }

    public function hasEmailVerified()
    {
        return $this->email_verified_at !== null;
    }
}
