<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\StudentRequestController;
use App\Http\Controllers\TeacherController;

Route::middleware("web")->group(function () {
    Route::get("/check-auth", [AuthController::class, "checkAuth"]);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get("/user", [UserController::class, "index"]);
    Route::get("/user/student", [StudentRequestController::class, "index"]);
});

Route::prefix('admin')->middleware(['web', 'auth:sanctum'])->group(function () {

    Route::prefix('requests')->group(function () {
        Route::get('/', [StudentRequestController::class, 'getCount']);
        Route::get('/all', [StudentRequestController::class, 'adminIndex']);
    });

    Route::prefix('teachers')->group(function () {
        Route::get('/', [TeacherController::class, 'index']);
        Route::post('/', [TeacherController::class, 'store']);
        Route::delete('/{teacher}', [TeacherController::class, 'destroy']);
    });
});

Route::prefix('services')->middleware(['web', 'auth:sanctum'])->group(function () {
    Route::prefix('groups')->group(function () {
        Route::get('/students', [GroupController::class, 'getStudents']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
    Route::post('/email/verify', [EmailVerificationController::class, 'verify']);
});

