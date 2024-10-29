<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        // \App\Http\Middleware\TrustHosts::class,
        \App\Http\Middleware\TrustProxies::class,
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array<string, array<int, class-string|string>>
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            // \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            // 'throttle:api',
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

        // authentication middleware
        //
        'verify.config' => 'App\Http\Middleware\Authentication\VerifyConfig',
        'verify.auth' => 'App\Http\Middleware\Authentication\Authenticate',
        'verify.password_reset' => 'App\Http\Middleware\Authentication\VerifyPasswordReset',
        'verify.email_verification' => 'App\Http\Middleware\Authentication\VerifyEmailVerification',
        'verify.account' => 'App\Http\Middleware\Authentication\VerifyAccount',
        'verify.user_identity' => 'App\Http\Middleware\Authentication\VerifyUserIdentity',

        // user middleware
        //
        'verify.user' => 'App\Http\Middleware\Users\VerifyUser',
        'verify.admin' => 'App\Http\Middleware\Users\VerifyAdmin',
        'verify.admin_invitation' => 'App\Http\Middleware\Users\VerifyAdminInvitation',
        'verify.settings' => 'App\Http\Middleware\Users\VerifySettings',
        'verify.user_event' => 'App\Http\Middleware\Users\VerifyUserEvent',

        // news middleware
        //
        'verify.topic' => 'App\Http\Middleware\Topics\VerifyTopic',
        'verify.topic_invitation' => 'App\Http\Middleware\Topics\VerifyTopicInvitation',
        'verify.post' => 'App\Http\Middleware\Topics\VerifyPost',

        // messaging middleware
        //
        'verify.chat' => 'App\Http\Middleware\Chats\VerifyChat',
        'verify.chat_message' => 'App\Http\Middleware\Chats\VerifyChatMessage',

        // task tracking middleware
        //
        'verify.project' => 'App\Http\Middleware\Projects\VerifyProject',
        'verify.task' => 'App\Http\Middleware\Projects\VerifyTask',

        // commenting middleware
        //
        'verify.comment' => 'App\Http\Middleware\Comments\VerifyComment',
        'verify.reply' => 'App\Http\Middleware\Comments\VerifyReply',

        // cloud storage middleware
        //
        'verify.storage_access' => 'App\Http\Middleware\Storage\VerifyStorageAccess',
    ];
}
