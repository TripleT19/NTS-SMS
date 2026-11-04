<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateGeneralSettingsRequest;
use App\Settings\GeneralSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class GeneralSettingsController extends Controller
{
    public function show(GeneralSettings $general): JsonResponse
    {
        return response()->json([
            'app_name'        => $general->app_name,
            'tagline'         => $general->tagline,
            'logo_url'        => $general->logo_path ? '/storage/' . $general->logo_path : null,
            'favicon_url'     => $general->favicon_path ? '/storage/' . $general->favicon_path : null,
            'primary_color'   => $general->primary_color,
            'secondary_color' => $general->secondary_color,
            'timezone'        => $general->timezone,
            'locale'          => $general->locale,
        ]);
    }

    public function update(UpdateGeneralSettingsRequest $request, GeneralSettings $general): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($general->logo_path) {
                Storage::disk('public')->delete($general->logo_path);
            }
            $data['logo_path'] = $request->file('logo')->store('branding', 'public');
        }

        if ($request->hasFile('favicon')) {
            if ($general->favicon_path) {
                Storage::disk('public')->delete($general->favicon_path);
            }
            $data['favicon_path'] = $request->file('favicon')->store('branding', 'public');
        }

        unset($data['logo'], $data['favicon']);

        foreach ($data as $key => $value) {
            $general->{$key} = $value;
        }
        $general->save();

        activity('settings')
            ->causedBy($request->user())
            ->withProperties(['group' => 'general', 'changed' => array_keys($data)])
            ->log('General settings updated');

        return response()->json(['message' => 'Settings saved.']);
    }
}