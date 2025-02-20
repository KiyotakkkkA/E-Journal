<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Institute;
use App\Http\Controllers\Controller;

class InstitutesController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $institute = Institute::create($validated);

        return response()->json($institute, 201);
    }

    public function destroy(Institute $institute)
    {
        $institute->makeDeleted();
        return response()->json(['message' => 'Institute deleted successfully']);
    }

    public function update(Institute $institute, Request $request)
    {
        $institute->update($request->all());
        return response()->json(['message' => 'Institute updated successfully']);
    }
}
