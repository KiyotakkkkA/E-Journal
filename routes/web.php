<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\StudentRequestController;

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
