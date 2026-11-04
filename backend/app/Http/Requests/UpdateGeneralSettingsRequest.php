<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGeneralSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('settings.general.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'app_name'        => ['required', 'string', 'max:60'],
            'tagline'         => ['nullable', 'string', 'max:120'],
            'primary_color'   => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'secondary_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'timezone'        => ['required', 'timezone'],
            'locale'          => ['required', 'string', 'max:10'],
            'logo'            => ['nullable', 'image', 'mimes:png,jpg,jpeg,svg', 'max:2048'],
            'favicon'         => ['nullable', 'mimes:png,ico,svg', 'max:512'],
        ];
    }
}