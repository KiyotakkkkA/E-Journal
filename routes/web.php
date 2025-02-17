<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\StudentRequestController;
use App\Http\Controllers\Api\GroupController;

Route::prefix('admin')->middleware(['web', 'auth:sanctum'])->group(function () {
    Route::prefix('groups')->group(function () {
        Route::post('/', [GroupController::class, 'store']);
        Route::put('/{group}', [GroupController::class, 'update']);
        Route::delete('/{group}', [GroupController::class, 'delete']);
    });

    Route::prefix('requests')->group(function () {
        Route::post('/{request}/approve', [StudentRequestController::class, 'approve']);
        Route::post('/{request}/reject', [StudentRequestController::class, 'reject']);
    });
});

Route::middleware("auth")->group(function () {
    Route::post("/user/student", [StudentRequestController::class, "store"]);
});

Route::middleware("web")->group(function () {
    Route::post("/register", [AuthController::class, "register"]);
    Route::post("/login", [AuthController::class, "login"]);
    Route::post("/logout", [AuthController::class, "logout"]);
});

Route::get('/{path?}', function () {
    return Inertia::render('App');
})->where('path', '.*');


require __DIR__.'/auth.php';
