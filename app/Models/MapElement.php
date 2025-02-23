<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MapElement extends Model
{
    protected $fillable = [
        'type',
        'floor',
        'position_x',
        'position_y'
    ];

    protected $casts = [
        'position_x' => 'integer',
        'position_y' => 'integer',
        'floor' => 'integer'
    ];
}
