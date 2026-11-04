<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Settings\GeneralSettings;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        // Because the settings are now created by migrations,
        // we can safely load them and update the defaults.
        $general = app(GeneralSettings::class);
        
        // Only set these if they are currently empty (first install)
        if (empty($general->app_name)) {
            $general->app_name        = env('APP_NAME', 'NTS SMS');
            $general->primary_color   = '#1E88E5';
            $general->secondary_color = '#00C853';
            $general->timezone        = config('app.timezone', 'Africa/Blantyre');
            $general->locale          = config('app.locale', 'en');
            $general->save();
        }
    }
}