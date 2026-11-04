<?php

namespace App\Settings\Casts;

use Illuminate\Support\Facades\Crypt;
use Spatie\LaravelSettings\SettingsCasts\SettingsCast;
use Throwable;

class EncryptedCast implements SettingsCast
{
    public function get($payload): ?string
    {
        if ($payload === null || $payload === '') {
            return null;
        }

        try {
            return Crypt::decryptString($payload);
        } catch (Throwable $e) {
            // Value in DB isn't decryptable with the current APP_KEY.
            // Either it's plaintext left over from a debugging session,
            // or it was encrypted with an older APP_KEY. Treat it as
            // "no password set" so the caller forces a re-save.
            return null;
        }
    }

    public function set($payload): ?string
    {
        if ($payload === null || $payload === '') {
            return null;
        }

        return Crypt::encryptString($payload);
    }
}