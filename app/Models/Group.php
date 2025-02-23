<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\GroupHistory;
use Illuminate\Support\Facades\DB;

class Group extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'max_students', 'students_count', 'is_active'];

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function history()
    {
        return $this->hasMany(GroupHistory::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    private function makeDeleted()
    {
        $this->history()->create([
            'group_id' => $this->id,
            'status' => 'deleted',
        ]);

        $this->is_active = false;
        $this->save();
    }

    public function deleteTransactions()
    {
        DB::beginTransaction();
        try {
            $students = $this->students;
            foreach ($students as $student) {
                $approvedRequest = $student->getApprovedRequest();

            if ($approvedRequest) {
                    $approvedRequest->status = 'group_deleted';
                    $approvedRequest->save();
                }
            }
            $this->makeDeleted();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function makeUpdated($data)
    {
        $this->history()->create([
            'group_id' => $this->id,
            'status' => 'renamed',
        ]);

        $this->fill($data);
        $this->save();
    }

    public static function makeCreated($data)
    {
        $group = self::create($data);

        $group->history()->create([
            'group_id' => $group->id,
            'status' => 'created',
        ]);

        return $group;
    }
}
