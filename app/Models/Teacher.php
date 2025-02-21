<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = ["position", "degree", "user_id", "cafedra_id"];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cafedra()
    {
        return $this->belongsTo(Cafedra::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}
