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
use App\Http\Controllers\Api\DisciplineController;
use App\Http\Controllers\Api\UserStatusController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\StatisticsController;

Route::middleware("web")->group(function () {
    Route::get("/check-auth", [AuthController::class, "checkAuth"]);
});

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::prefix('user')->group(function () {
        Route::get("/", [UserController::class, "index"]);
        Route::get("/student", [StudentRequestController::class, "index"]);
    });

    Route::get('/online-users', [UserStatusController::class, 'getOnlineUsers']);
    Route::post('/user-status', [UserStatusController::class, 'updateUserStatus']);

    Route::get('/statistics/total', [StatisticsController::class, 'getTotalData']);
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

    Route::prefix('disciplines')->group(function () {
        Route::get('/', [DisciplineController::class, 'index']);
        Route::post('/', [DisciplineController::class, 'store']);
        Route::put('/{discipline}', [DisciplineController::class, 'update']);
        Route::delete('/{discipline}', [DisciplineController::class, 'destroy']);

        Route::post('/bind', [DisciplineController::class, 'bindDisciplineToTeacher']);
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

Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::prefix('email')->group(function () {
        Route::post('/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
        Route::post('/verify', [EmailVerificationController::class, 'verify']);
    });

    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'getMessages']);
        Route::post('/send', [MessageController::class, 'sendMessage']);
    });
});

