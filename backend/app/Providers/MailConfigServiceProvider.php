<?php

namespace App\Providers;

use App\Settings\GeneralSettings;
use App\Settings\MailSettings;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use Throwable;

class MailConfigServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Skip during installer or before the DB exists.
        if (!config('app.installed')) {
            return;
        }

        try {
            $mail = app(MailSettings::class);

            // Require all three: without a password the SMTP mailer
            // would try to authenticate anonymously, which almost
            // every provider rejects with a 535.
            if (!$mail->host || !$mail->username || !$mail->password) {
                return; // fall back to .env
            }

            $general = app(GeneralSettings::class);

            Config::set([
                'mail.default'                 => 'smtp',
                'mail.mailers.smtp.host'       => $mail->host,
                'mail.mailers.smtp.port'       => $mail->port,
                'mail.mailers.smtp.username'   => $mail->username,
                'mail.mailers.smtp.password'   => $mail->password,
                'mail.mailers.smtp.encryption' => $mail->encryption,
                'mail.from.address'            => $mail->from_address ?? config('mail.from.address'),
                'mail.from.name'               => $mail->from_name ?? $general->app_name,
                'mail.reply_to.address'        => $mail->reply_to_address ?? $mail->from_address,
            ]);
        } catch (Throwable $e) {
            // DB/settings unavailable — keep .env defaults.
        }
    }
}