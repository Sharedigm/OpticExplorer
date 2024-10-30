<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    //
    // mail services
    //

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    //
    // language translation services
    //

    'ibm_translation' => [
        'api_url' => 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/' . env('IBM_TRANSLATION_INSTANCE_ID') . '/v3/translate?version=2018-05-01',
        'api_key' => env('IBM_TRANSLATION_API_KEY'),
        'enabled' => env('IBM_TRANSLATION_ENABLED')
    ],

    //
    // SMS services
    //

    'nexmo' => [
        'sms_from' => env('NEXMO_SMS_FROM'),
        'enabled' => env('NEXMO_ENABLED')
    ],

    //
    // authentication services
    //

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('APP_URL') . '/public/api/providers/google/callback',
        'enabled' => env('GOOGLE_ENABLED')
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'redirect' => env('APP_URL') . '/public/api/providers/facebook/callback',
        'enabled' => env('FACEBOOK_ENABLED')
    ],

    'github' => [
        'client_id' => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect' => env('APP_URL') . '/public/api/providers/github/callback',
        'enabled' => env('GITHUB_ENABLED')
    ],

    //
    // vector database services
    //

    'pinecone' => [
        'api_key' => env('PINECONE_API_KEY', ''),
        'environment' => env('PINECONE_ENVIRONMENT', ''),
    ]
];