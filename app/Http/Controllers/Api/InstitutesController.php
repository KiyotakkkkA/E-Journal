<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Institute;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
class InstitutesController extends Controller
{

    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на создание института'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $institute = Institute::create($validated);

        return response()->json($institute, 201);
    }

    public function destroy(Institute $institute)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на удаление института'], 403);
        }

        $institute->makeDeleted();
        return response()->json(['message' => 'Institute deleted successfully']);
    }

    public function update(Institute $institute, Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'У вас нет прав на обновление института'], 403);
        }

        $institute->update($request->all());
        return response()->json(['message' => 'Institute updated successfully']);
    }
}
