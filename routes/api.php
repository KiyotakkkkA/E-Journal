<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\StudentRequestController;

Route::middleware("web")->group(function () {
    Route::get("/check-auth", [AuthController::class, "checkAuth"]);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get("/user", [UserController::class, "index"]);
    Route::get("/user/student", [StudentRequestController::class, "index"]);
});

Route::prefix('admin')->middleware(['web', 'auth:sanctum'])->group(function () {
    Route::post('/groups', [GroupController::class, 'store']);
    Route::get('/groups/students', [GroupController::class, 'getStudents']);

    Route::get('/requests', [StudentRequestController::class, 'getCount']);
    Route::get('/requests/all', [StudentRequestController::class, 'adminIndex']);
    Route::post('/requests/{request}/approve', [StudentRequestController::class, 'approve']);
    Route::post('/requests/{request}/reject', [StudentRequestController::class, 'reject']);
});
