<?php

namespace App\Settings;

use App\Settings\Casts\EncryptedCast;
use Spatie\LaravelSettings\Settings;

class MailSettings extends Settings
{
    public ?string $host;
    public ?int $port;
    public ?string $username;
    public ?string $password;
    public ?string $encryption;
    public ?string $from_address;
    public ?string $from_name;
    public ?string $reply_to_address;

    public static function group(): string
    {
        return 'mail';
    }

    /**
     * Spatie Laravel Settings requires casts to be declared here
     * via a static method. A `$casts` property is silently ignored.
     */
    public static function casts(): array
    {
        return [
            'password' => EncryptedCast::class,
        ];
    }
}