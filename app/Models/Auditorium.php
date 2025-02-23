<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Auditorium extends Model
{
    use HasFactory;

    protected $table = 'auditoriums';

    protected $fillable = [
        'number',
        'name',
        'type',
        'capacity',
        'equipment',
        'has_projector',
        'has_internet',
        'description',
        'is_active',
    ];

    protected $casts = [
        'equipment' => 'array',
        'is_active' => 'boolean',
        'has_projector' => 'boolean',
        'has_internet' => 'boolean',
    ];
}
