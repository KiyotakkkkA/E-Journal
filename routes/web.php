<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\StudentRequestController;
use App\Http\Controllers\Api\GroupController;
use Nuwave\Lighthouse\Support\Http\Middleware\AcceptJson;
use App\Http\Controllers\EmailVerificationController;

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

    Route::prefix('email')->group(function () {
        Route::post('/verify', [EmailVerificationController::class, 'verify']);
        Route::post('/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail']);
    });

});


Route::group([
    'prefix' => 'graphql',
    'middleware' => [
        'web',
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        AcceptJson::class,
    ],
], function () {
    Route::post('/', [
        \Nuwave\Lighthouse\Support\Http\Controllers\GraphQLController::class,
        '__invoke'
    ]);
});

Route::get('/{path?}', function () {
    return Inertia::render('App');
})->where('path', '.*');

Route::get('/sanctum/csrf-cookie', function () {
    $token = csrf_token();
    return response()->json(['csrf_token' => $token]);
})->middleware('web');


require __DIR__.'/auth.php';
