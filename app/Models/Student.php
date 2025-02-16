<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['student_code', 'user_id', 'group_id'];

    public static function generateUniqueCode()
    {
        do {
            $string = Str::random(10) . time();

            $code = strtoupper(substr(md5($string), 0, 6));

            $exists = self::where('student_code', $code)->exists();
        } while ($exists);

        return $code;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function requests()
    {
        return $this->hasMany(StudentRequest::class);
    }
}
