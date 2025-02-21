<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discipline extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'types',
        'is_active'
    ];

    protected $casts = [
        'types' => 'array',
        'is_active' => 'boolean'
    ];

    public function makeDeleted()
    {
        $this->is_active = false;
        $this->save();

        $this->lessons()->delete();
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}
