<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GeneralSettingsController;
use App\Http\Controllers\Api\MailSettingsController;
use App\Http\Controllers\Api\PublicSettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/settings/public', [PublicSettingsController::class, 'show']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);              // ← must exist
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/settings/general', [GeneralSettingsController::class, 'show'])
        ->middleware('can:settings.general.update');
    Route::put('/settings/general', [GeneralSettingsController::class, 'update']);

    Route::get('/settings/mail', [MailSettingsController::class, 'show'])
        ->middleware('can:settings.mail.update');
    Route::put('/settings/mail', [MailSettingsController::class, 'update']);
    Route::post('/settings/mail/test', [MailSettingsController::class, 'test']);
});