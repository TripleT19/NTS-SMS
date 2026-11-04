<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TestMailRequest;
use App\Http\Requests\UpdateMailSettingsRequest;
use App\Mail\TestMail;
use App\Settings\GeneralSettings;
use App\Settings\MailSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Spatie\LaravelSettings\Exceptions\MissingSettings;
use Throwable;

class MailSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        try {
            $mail = app(MailSettings::class);

            return response()->json([
                'host'             => $mail->host,
                'port'             => $mail->port,
                'username'         => $mail->username,
                'has_password'     => !empty($mail->password),
                'encryption'       => $mail->encryption,
                'from_address'     => $mail->from_address,
                'from_name'        => $mail->from_name,
                'reply_to_address' => $mail->reply_to_address,
            ]);
        } catch (MissingSettings $e) {
            return response()->json([
                'host'             => null,
                'port'             => null,
                'username'         => null,
                'has_password'     => false,
                'encryption'       => null,
                'from_address'     => null,
                'from_name'        => null,
                'reply_to_address' => null,
            ]);
        }
    }

    public function update(UpdateMailSettingsRequest $request): JsonResponse
    {
        try {
            $mail = app(MailSettings::class);
            $data = $request->validated();

            // Never overwrite an existing password with an empty one.
            if (empty($data['password'])) {
                unset($data['password']);
            }

            foreach ($data as $key => $value) {
                $mail->{$key} = $value;
            }
            $mail->save();

            Artisan::call('queue:restart');

            activity('settings')
                ->causedBy($request->user())
                ->withProperties(['group' => 'mail', 'changed' => array_keys($data)])
                ->log('Mail settings updated');

            return response()->json(['message' => 'Mail settings saved successfully.']);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Error saving settings: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function test(TestMailRequest $request): JsonResponse
    {
        $data = $request->validated();
        $general = app(GeneralSettings::class);

        // Resolve the password: use the one submitted with the test request
        // if present; otherwise fall back to whatever is currently stored.
        // `!empty()` is critical here — `??` only treats null as "unset"
        // and would silently accept an empty string, sending a blank
        // password to the SMTP server and producing a 535 auth failure.
        $existingPassword = null;
        try {
            $existingPassword = app(MailSettings::class)->password;
        } catch (MissingSettings $e) {
            // No mail settings saved yet — ignore.
        }

        $password = !empty($data['password'])
            ? $data['password']
            : $existingPassword;

        if (empty($password)) {
            return response()->json([
                'message' => 'No password provided and none stored. '.
                             'Save the mail settings with a password first, then try again.',
            ], 422);
        }

        try {
            $mailer = Mail::build([
                'transport'  => 'smtp',
                'host'       => $data['host'],
                'port'       => $data['port'],
                'username'   => $data['username'],
                'password'   => $password,
                'encryption' => $data['encryption'] ?? null,
            ]);

            $mailer->alwaysFrom(
                $data['from_address'],
                $data['from_name'] ?? $general->app_name
            );

            $mailer->to($data['recipient'])
                   ->send(new TestMail($general->app_name));

            return response()->json(['message' => 'Test email sent successfully.']);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Test failed: ' . $e->getMessage(),
            ], 422);
        }
    }
}