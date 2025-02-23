<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditorium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditoriumController extends Controller
{
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
            return response()->json(['message' => 'У вас нет прав на редактирование аудитории'], 403);
        }

        $validated = $request->validate([
            'number' => 'required|string|unique:auditoriums,number,' . $auditorium->id,
            'name' => 'nullable|string',
            'type' => 'required|in:regular,lecture,computer,laboratory,conference',
            'capacity' => 'required|integer|min:1',
            'equipment' => 'nullable|array',
            'has_projector' => 'boolean',
            'has_internet' => 'boolean',
            'description' => 'nullable|string'
        ]);

        $auditorium->update($validated);

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



