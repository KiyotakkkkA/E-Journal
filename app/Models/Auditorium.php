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
        'floor',
        'equipment',
        'has_projector',
        'has_internet',
        'description',
        'position_x',
        'position_y',
        'is_active'
    ];

    protected $casts = [
        'position_x' => 'integer',
        'position_y' => 'integer',
        'floor' => 'integer',
        'capacity' => 'integer',
        'has_projector' => 'boolean',
        'has_internet' => 'boolean',
        'is_active' => 'boolean',
        'equipment' => 'array'
    ];
}
