<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.app_name',        'NTS SMS');
        $this->migrator->add('general.tagline',         'School Management System');
        $this->migrator->add('general.logo_path',       null);
        $this->migrator->add('general.favicon_path',    null);
        $this->migrator->add('general.primary_color',   '#1E88E5');
        $this->migrator->add('general.secondary_color', '#00C853');
        $this->migrator->add('general.timezone',        'Africa/Blantyre');
        $this->migrator->add('general.locale',          'en');
    }

    public function down(): void
    {
        $this->migrator->delete('general.app_name');
        $this->migrator->delete('general.tagline');
        $this->migrator->delete('general.logo_path');
        $this->migrator->delete('general.favicon_path');
        $this->migrator->delete('general.primary_color');
        $this->migrator->delete('general.secondary_color');
        $this->migrator->delete('general.timezone');
        $this->migrator->delete('general.locale');
    }
};