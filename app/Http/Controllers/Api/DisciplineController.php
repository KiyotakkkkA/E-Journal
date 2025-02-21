<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Discipline;
use Illuminate\Http\Request;
use App\Models\Teacher;
use Illuminate\Support\Facades\Log;

class DisciplineController extends Controller
{
    use HasFactory;

    public function index()
    {
        return Discipline::where('is_active', true)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:disciplines,code',
            'name' => 'required|string',
            'types' => 'required|array|min:1',
            'types.*' => 'string|in:lecture,practice,lab,seminar'
        ]);

        $discipline = Discipline::create($validated);

        return response()->json($discipline, 201);
    }

    public function update(Request $request, Discipline $discipline)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:disciplines,code,' . $discipline->id,
            'name' => 'required|string',
            'types' => 'required|array|min:1',
            'types.*' => 'string|in:lecture,practice,lab,seminar'
        ]);

        $discipline->update($validated);

        return response()->json($discipline);
    }

    public function destroy(Discipline $discipline)
    {
        $discipline->makeDeleted();
        return response()->json(['message' => 'Discipline deleted successfully']);
    }

    public function bindDisciplineToTeacher(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,user_id',
            'disciplines' => 'required|array|min:1',
            'disciplines.*.id' => 'required|exists:disciplines,id',
            'disciplines.*.types' => 'present|array',
            'disciplines.*.types.*' => 'string|in:lecture,practice,lab,seminar'
        ]);

        $teacher = Teacher::where('user_id', $validated['teacher_id'])->first();

        $teacher->lessons()->delete();

        foreach ($validated['disciplines'] as $discipline) {
            if (!empty($discipline['types'])) {
                foreach ($discipline['types'] as $type) {
                    $teacher->lessons()->create([
                        'discipline_id' => $discipline['id'],
                        'type' => $type
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Disciplines bound to teacher successfully']);
    }
}

