<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestMailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('settings.mail.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'host'         => ['required', 'string'],
            'port'         => ['required', 'integer'],
            'username'     => ['required', 'string'],
            'password'     => ['nullable', 'string'],
            'encryption'   => ['nullable', 'in:tls,ssl'],
            'from_address' => ['required', 'email'],
            'from_name'    => ['nullable', 'string'],
            'recipient'    => ['required', 'email'],
        ];
    }
}