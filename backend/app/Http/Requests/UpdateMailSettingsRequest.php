<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMailSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('settings.mail.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'host'             => ['required', 'string', 'max:255'],
            'port'             => ['required', 'integer', 'between:1,65535'],
            'username'         => ['required', 'string', 'max:255'],
            'password'         => ['nullable', 'string', 'max:255'],
            'encryption'       => ['nullable', 'in:tls,ssl'],
            'from_address'     => ['required', 'email', 'max:255'],
            'from_name'        => ['nullable', 'string', 'max:255'],
            'reply_to_address' => ['nullable', 'email', 'max:255'],
        ];
    }
}