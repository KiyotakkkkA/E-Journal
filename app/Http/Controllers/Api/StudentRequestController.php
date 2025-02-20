<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\StudentRequests;
use App\Models\Student;

class StudentRequestController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();
        $reqPending = StudentRequests::where('user_id', $user->id)->where('status', 'pending')->get();
        $reqApproved = StudentRequests::where('user_id', $user->id)->where('status', 'approved')->get();
        if (($reqPending->count() >= 1 || $reqApproved->count() >= 1) && ($user->isStudent() && $user->student->getActiveGroup() !== null)) {
            return response()->json(['error' => 'Вы уже отправили заявку на вступление в группу', 'status' => false]);
        }
        StudentRequests::create([
            'name' => $request->name,
            'user_id' => $user->id,
            'group_id' => $request->group_id,
            'status' => 'pending',
        ]);
        return response()->json(['message' => 'Заявка на вступление в группу отправлена', 'status' => true]);
    }

    public function index()
    {
        $user = Auth::user();

        $reqPending = StudentRequests::with('group')
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->get();

        $reqApproved = StudentRequests::with('group')
            ->where('user_id', $user->id)
            ->where('status', 'approved')
            ->get();

        $reqRejected = StudentRequests::with('group')
            ->where('user_id', $user->id)
            ->where('status', 'rejected')
            ->get();

        $reqGroupDeleted = StudentRequests::with('group')
            ->where('user_id', $user->id)
            ->where('status', 'group_deleted')
            ->get();

        return response()->json([
            'requests' => [
                'pending' => $reqPending,
                'approved' => $reqApproved,
                'rejected' => $reqRejected,
                'group_deleted' => $reqGroupDeleted,
            ]
        ]);
    }

    public function getCount(Request $request)
    {
        $user = Auth::user();
        if ($user->hasPermissionTo('view_admin_panel')) {
            $reqPending = StudentRequests::where('status', 'pending')->get();
            return response()->json(['requestsCount' => $reqPending->count()]);
        }
        return response()->json(['requestsCount' => 0]);
    }

    public function adminIndex()
    {
        $user = Auth::user();
        if ($user->hasPermissionTo('view_admin_panel')) {
            $requests = StudentRequests::with('group')
                ->where('status', 'pending')
                ->get();
            return response()->json(['requests' => $requests]);
        }
        return response()->json(['requests' => []], 403);
    }

    public function approve(StudentRequests $request)
    {
        $user = Auth::user();
        if ($user->hasPermissionTo('view_admin_panel')) {
            if ($request->user->isEmailVerified()) {
                $request->update(['status' => 'approved']);
                $request->group->students_count += 1;
                $request->group->save();

                Student::create([
                    'student_code' => Student::generateUniqueCode(),
                    'user_id' => $request->user_id,
                    'group_id' => $request->group_id,
                ]);
                $request->user->name = $request->name;
                $request->user->role_id = 3;
                $request->user->save();
            }
            if ($request->user->isStudent() && ($request->user->student->getActiveGroup() === null)) {
                $request->update(['status' => 'approved']);
                $request->user->student->group_id = $request->group_id;
                $request->user->student->save();
            }

            return response()->json(['message' => 'Request approved']);
        }
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function reject(StudentRequests $request)
    {
        $user = Auth::user();
        if ($user->hasPermissionTo('view_admin_panel')) {
            $request->update(['status' => 'rejected']);
            return response()->json(['message' => 'Request rejected']);
        }
        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
