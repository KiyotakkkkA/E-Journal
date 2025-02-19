<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use App\Models\StudentRequests;

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

    public function getActiveGroup()
    {
        return $this->group()->where('is_active', true)->first();
    }

    public function requests()
    {
        return $this->hasMany(StudentRequests::class, 'user_id', 'user_id');
    }

    public function getApprovedRequest()
    {
        return $this->requests()->where('status', 'approved')->first();
    }
}
