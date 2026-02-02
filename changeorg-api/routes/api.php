<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetitionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Ruta falsa de login al que redirige Laravel para que de 401 y no excepción con 500
Route::get('/login', function () {
    return response()->json(['error' => 'Unauthenticated'], 401);
})->name('login');

Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);

Route::middleware('auth:api')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
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
    Route::get('petitions/{petition}/files', 'getImage');
});
