<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $app_name;
    public string $tagline;
    public ?string $logo_path;
    public ?string $favicon_path;
    public string $primary_color;
    public string $secondary_color;
    public string $timezone;
    public string $locale;

    public static function group(): string
    {
        return 'general';
    }
}