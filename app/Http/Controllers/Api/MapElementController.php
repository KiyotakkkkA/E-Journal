<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MapElement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
class MapElementController extends Controller
{
    public function index()
    {
        return MapElement::all();
    }

    public function store(Request $request)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'No permission'], 403);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:stairs,elevator,restroom',
            'floor' => 'required|integer|min:1',
            'position_x' => 'required|integer',
            'position_y' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $mapElement = MapElement::create($request->all());

        return response()->json($mapElement, 201);
    }

    public function update(Request $request, $id)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'No permission'], 403);
        }

        $mapElement = MapElement::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'position_x' => 'required|integer',
            'position_y' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $mapElement->update($request->only(['position_x', 'position_y']));

        return response()->json($mapElement);
    }

    public function destroy($id)
    {
        if (!Auth::user()->hasPermissionTo('make_structure')) {
            return response()->json(['message' => 'No permission'], 403);
        }

        $mapElement = MapElement::findOrFail($id);
        $mapElement->delete();

        return response()->json(null, 204);
    }
}
