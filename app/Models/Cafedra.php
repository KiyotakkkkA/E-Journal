<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cafedra extends Model
{
    use HasFactory;

    protected $fillable = ["name", "is_active", "institute_id"];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function institute()
    {
        return $this->belongsTo(Institute::class);
    }

    public function makeDeleted()
    {
        $this->is_active = false;
        $this->save();
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }
}

