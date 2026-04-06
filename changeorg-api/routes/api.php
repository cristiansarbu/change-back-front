<?php

use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminPetitionController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PetitionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Ruta falsa de login al que redirige Laravel para que de 401 y no excepción con 500
Route::get('/login', function () {
    return response()->json(['error' => 'Unauthenticated'], 401);
})->name('login');

Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/refresh', [AuthController::class, 'refresh']);

Route::middleware('auth:api')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
    Route::controller(PetitionController::class)->group(function () {
        Route::delete('petitions/{petition}', 'delete')->can('delete', 'petition');
        Route::put('petitions/sign/{petition}', 'sign');
        Route::put('petitions/status/{petition}', 'changeStatus')->can('changeStatus', 'petition');
        Route::put('petitions/{petition}', 'update')->can('update', 'petition');
        Route::post('petitions', 'store');
        Route::get('signedpetitions', 'signedPetitions');
        Route::get('mypetitions', 'listMine');
    });
});

Route::controller(PetitionController::class)->group(function () {
    Route::get('petitions', 'index');
    Route::get('petitions/{petition}', 'show');
});

Route::controller(CategoryController::class)->group(function () {
    Route::get('categories', 'index');
});

// RUTAS DE ADMINISTRADOR
Route::middleware(['auth:api', 'is_admin'])->prefix('admin')->group(function () {
    // Peticiones
    Route::controller(AdminPetitionController::class)->group(function () {
        Route::get('petitions', 'index');
        Route::get('petitions/{petition}', 'show');
        Route::post('petitions', 'store');
        Route::put('petitions/{petition}', 'update');
        Route::put('petitions/status/{petition}', 'changeStatus');
        Route::delete('petitions/{petition}', 'delete');
    });

    // Categorías
    Route::controller(AdminCategoryController::class)->group(function () {
        Route::get('categories', 'index');
        Route::post('categories', 'store');
        Route::put('categories/{category}', 'update');
        Route::delete('categories/{category}', 'delete');
    });

    // Usuarios
    Route::controller(AdminUserController::class)->group(function () {
        Route::get('users', 'index');
        Route::get('users/{user}', 'show');
        Route::put('users/{user}', 'update');
        Route::delete('users/{user}', 'delete');
    });
});
