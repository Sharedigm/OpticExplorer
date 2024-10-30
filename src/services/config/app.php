<?php

use Illuminate\Support\Facades\Facade;

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to place the application's name in a notification or
    | any other location as required by the application or its packages.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URLs
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | your application so that it is used when running Artisan tasks.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),
    'asset_url' => env('ASSET_URL', null),
    'client_url' => env('APP_CLIENT_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Password Encryption
    |--------------------------------------------------------------------------
    |
    | This setting determines the algorithm used by the application to encrypt 
    | passwords.  Note:  If password encryption is handled by LDAP instead of
    | the application code, then this value should be set to NONE. 
    |
    */

    'password_encryption_method' => env('APP_PASSWORD_ENCRYPTION_METHOD', 'BCRYPT'),

   /*
    |--------------------------------------------------------------------------
    | Sign Up
    |--------------------------------------------------------------------------
    |
    | This setting determines whether the application allows user registration. 
    |
    */

    'sign_up_enabled' => env('APP_SIGN_UP', true),

    /*
    |--------------------------------------------------------------------------
    | Video Thumbnails
    |--------------------------------------------------------------------------
    |
    | This determines whether thumbnails are generated for video files. 
    |
    */

    'video_thumbnails_enabled' => env('APP_VIDEO_THUMBNAILS_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Metadata Helper Paths
    |--------------------------------------------------------------------------
    |
    | These are paths to auxilliary helper apps for finding metadata.
    |
    */

    'ffmpeg_binary_path' => env('APP_FFMPEG_BINARY_PATH', '/usr/local/bin/ffmpeg'),
    'ffprobe_binary_path' => env('APP_FFPROBE_BINARY_PATH', '/usr/local/bin/ffprobe'),
    'exif_tool_path' => env('APP_EXIF_TOOL_PATH', '/usr/local/bin/exiftool'),
    'listgeo_path' => env('APP_LISTGEO_PATH', '/usr/bin/listgeo'),
    'pdftotext_path' => env('APP_PDFTOTEXT_PATH', '/usr/bin/pdftotext'),

    /*
    |--------------------------------------------------------------------------
    | Default Disk Quota
    |--------------------------------------------------------------------------
    |
    | This determines the default disk quota per user. 
    |
    */

    'default_disk_quota' => env('APP_DEFAULT_DISK_QUOTA', '5G'),

    /*
    |--------------------------------------------------------------------------
    | Default Disk Quota
    |--------------------------------------------------------------------------
    |
    | This determines the default disk quota per user. 
    |
    */

    'invitation_disk_quota_bonus' => env('APP_INVITATION_DISK_QUOTA_BONUS', '0.25G'),

    /*
    |--------------------------------------------------------------------------
    | Default Folders
    |--------------------------------------------------------------------------
    |
    | This is the set of folder that are created upon initial account
    | creation. 
    |
    */

    'default_folders' => json_decode(env('APP_DEFAULT_FOLDERS', '')) ?? [
        '.Clipboard',
        'Audio',
        'Code',
        'Contacts',
        'Documents',
        'Favorites',
        'Maps',
        'Music',
        'Pictures',
        'Profile',
        'Public',
        'Research',
        'Videos',
        'Websites',
        'Trash'
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Groups
    |--------------------------------------------------------------------------
    |
    | This is the set of groups that are created upon initial account
    | creation. 
    |
    */

    'default_groups' => json_decode(env('APP_DEFAULT_GROUPS', '')) ?? [
        'Acquaintences' => '/Shared/Pictures/Emoji/Smileys/1F642.svg',
        'Colleagues' => '/Shared/Pictures/Emoji/Clothing/1F454.svg',
        'Friends' => '/Shared/Pictures/Emoji/Smileys/1F600.svg',
        'Family' => '/Shared/Pictures/Twemoji/Objects/Science/1f9ec.svg'
    ],

    /*
    |--------------------------------------------------------------------------
    | Default Topics
    |--------------------------------------------------------------------------
    |
    | This is the set of topics that are subscribed to upon initial account
    | creation. 
    |
    */

    'default_topics' => json_decode(env('APP_DEFAULT_TOPICS', '')) ?? [],

    /*
    |--------------------------------------------------------------------------
    | Generators
    |--------------------------------------------------------------------------
    |
    | This is the set of AI image generators. 
    |
    */

    'image_generators' => explode(', ', env('IMAGE_GENERATORS', '')) ?? [],

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. We have gone
    | ahead and set this to a sensible default for you out of the box.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by the translation service provider. You are free to set this value
    | to any of the locales which will be supported by the application.
    |
    */

    'locale' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Application Fallback Locale
    |--------------------------------------------------------------------------
    |
    | The fallback locale determines the locale to use when the current one
    | is not available. You may change the value to correspond to any of
    | the language folders that are provided through your application.
    |
    */

    'fallback_locale' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Faker Locale
    |--------------------------------------------------------------------------
    |
    | This locale will be used by the Faker PHP library when generating fake
    | data for your database seeds. For example, this will be used to get
    | localized telephone numbers, street address information and more.
    |
    */

    'faker_locale' => 'en_US',

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is used by the Illuminate encrypter service and should be set
    | to a random, 32 character string, otherwise these encrypted strings
    | will not be safe. Please do this before deploying an application!
    |
    */

    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',

    /*
    |--------------------------------------------------------------------------
    | Autoloaded Service Providers
    |--------------------------------------------------------------------------
    |
    | The service providers listed here will be automatically loaded on the
    | request to your application. Feel free to add your own services to
    | this array to grant expanded functionality to your applications.
    |
    */

    'providers' => [

        /*
         * Laravel Framework Service Providers...
         */
        Illuminate\Auth\AuthServiceProvider::class,
        Illuminate\Broadcasting\BroadcastServiceProvider::class,
        Illuminate\Bus\BusServiceProvider::class,
        Illuminate\Cache\CacheServiceProvider::class,
        Illuminate\Foundation\Providers\ConsoleSupportServiceProvider::class,
        Illuminate\Cookie\CookieServiceProvider::class,
        Illuminate\Database\DatabaseServiceProvider::class,
        Illuminate\Encryption\EncryptionServiceProvider::class,
        Illuminate\Filesystem\FilesystemServiceProvider::class,
        Illuminate\Foundation\Providers\FoundationServiceProvider::class,
        Illuminate\Hashing\HashServiceProvider::class,
        Illuminate\Mail\MailServiceProvider::class,
        Illuminate\Notifications\NotificationServiceProvider::class,
        Illuminate\Pagination\PaginationServiceProvider::class,
        Illuminate\Pipeline\PipelineServiceProvider::class,
        Illuminate\Queue\QueueServiceProvider::class,
        Illuminate\Redis\RedisServiceProvider::class,
        Illuminate\Auth\Passwords\PasswordResetServiceProvider::class,
        Illuminate\Session\SessionServiceProvider::class,
        Illuminate\Translation\TranslationServiceProvider::class,
        Illuminate\Validation\ValidationServiceProvider::class,
        Illuminate\View\ViewServiceProvider::class,

        /*
         * Package Service Providers...
         */

        /*
         * Application Service Providers...
         */
        App\Providers\AppServiceProvider::class,
        App\Providers\AuthServiceProvider::class,
        // App\Providers\BroadcastServiceProvider::class,
        App\Providers\EventServiceProvider::class,
        App\Providers\RouteServiceProvider::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Class Aliases
    |--------------------------------------------------------------------------
    |
    | This array of class aliases will be registered when this application
    | is started. However, feel free to register as many as you wish as
    | the aliases are "lazy" loaded so they don't hinder performance.
    |
    */

    'aliases' => Facade::defaultAliases()->merge([
        // ...
    ])->toArray(),
];