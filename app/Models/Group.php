<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'max_students', 'students_count', 'is_active'];

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
