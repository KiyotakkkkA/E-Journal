<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedules';
    protected $fillable = ['group_id', 'teacher_id', 'lesson_id', 'auditorium_id', 'day_of_week', 'week_type', 'start_time', 'end_time', 'is_active'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function auditorium()
    {
        return $this->belongsTo(Auditorium::class);
    }

    public static function getScheduleByGroupId($groupId)
    {
        return self::where('group_id', $groupId)->get();
    }
}
