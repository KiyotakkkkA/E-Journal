<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GroupHistory extends Model
{
    use HasFactory;

    protected $table = 'group_history';

    protected $fillable = ['group_id', 'status'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
