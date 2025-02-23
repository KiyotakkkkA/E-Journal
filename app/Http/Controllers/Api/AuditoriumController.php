<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditorium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuditoriumController extends Controller
{

    public function getInteractive()
    {
        return Auditorium::where('is_active', true)->orderBy('number')->get();
    }

    public function index()
    {
        return Auditorium::where('is_active', true)->get();
    }

    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на создание аудитории'], 403);
        }

        $validated = $request->validate([
            'number' => 'required|string|unique:auditoriums,number',
            'name' => 'nullable|string',
            'type' => 'required|in:regular,lecture,computer,laboratory,conference',
            'capacity' => 'required|integer|min:1',
            'floor' => 'required|integer|min:1|max:5',
            'equipment' => 'nullable|array',
            'has_projector' => 'boolean',
            'has_internet' => 'boolean',
            'description' => 'nullable|string'
        ]);

        $auditorium = Auditorium::create($validated);

        return response()->json($auditorium, 201);
    }

    public function update(Request $request, Auditorium $auditorium)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'No permission'], 403);
        }

        $validator = Validator::make($request->all(), [
            'number' => 'sometimes|required|string',
            'type' => 'sometimes|required|string',
            'capacity' => 'sometimes|required|integer',
            'floor' => 'sometimes|required|integer',
            'position_x' => 'sometimes|required|integer',
            'position_y' => 'sometimes|required|integer',
            'name' => 'nullable|string',
            'equipment' => 'nullable|array',
            'has_projector' => 'boolean',
            'has_internet' => 'boolean',
            'description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $auditorium->update($request->all());

        return response()->json($auditorium);
    }

    public function destroy(Auditorium $auditorium)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на удаление аудитории'], 403);
        }

        $auditorium->update(['is_active' => false]);

        return response()->json(['message' => 'Auditorium deleted successfully']);
    }
}



