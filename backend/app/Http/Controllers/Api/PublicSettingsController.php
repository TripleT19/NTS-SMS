<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Settings\GeneralSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PublicSettingsController extends Controller
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
        ]);
    }
}