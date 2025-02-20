<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\StudentRequestController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\InstitutesController;
use App\Http\Controllers\Api\CafedrasController;


Route::middleware("web")->group(function () {
    Route::get("/check-auth", [AuthController::class, "checkAuth"]);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get("/user", [UserController::class, "index"]);
    Route::get("/user/student", [StudentRequestController::class, "index"]);
});

Route::prefix('admin')->middleware(['web', 'auth:sanctum'])->group(function () {

    Route::prefix('institutes')->group(function () {
        Route::post('/', [InstitutesController::class, 'store']);
        Route::put('/{institute}', [InstitutesController::class, 'update']);
        Route::delete('/{institute}', [InstitutesController::class, 'destroy']);
    });

    Route::prefix('cafedras')->group(function () {
        Route::post('/', [CafedrasController::class, 'store']);
        Route::put('/{cafedra}', [CafedrasController::class, 'update']);
        Route::delete('/{cafedra}', [CafedrasController::class, 'destroy']);

        Route::get('/{cafedra}/teachers', [CafedrasController::class, 'getCafedraTeachers']);
        Route::post('/{cafedra}/teachers', [CafedrasController::class, 'assignTeachers']);
        Route::delete('/{cafedra}/teachers', [CafedrasController::class, 'removeTeacher']);
    });

    Route::prefix('requests')->group(function () {
        Route::get('/', [StudentRequestController::class, 'getCount']);
        Route::get('/all', [StudentRequestController::class, 'adminIndex']);
    });

    Route::prefix('teachers')->group(function () {
        Route::get('/', [TeacherController::class, 'index']);
        Route::post('/', [TeacherController::class, 'store']);
        Route::put('/{teacher}', [TeacherController::class, 'update']);
        Route::delete('/{teacher}', [TeacherController::class, 'destroy']);
    });
});

Route::prefix('services')->middleware(['web', 'auth:sanctum'])->group(function () {
    Route::prefix('groups')->group(function () {
        Route::get('/students', [GroupController::class, 'getStudents']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('email')->group(function () {
        Route::post('/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
        Route::post('/verify', [EmailVerificationController::class, 'verify']);
    });
});

