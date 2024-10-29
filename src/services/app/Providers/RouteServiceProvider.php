<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();
        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapApiRoutes('routes/admin.php');
        $this->mapApiRoutes('routes/auth.php');
        $this->mapApiRoutes('routes/comments.php');
        $this->mapApiRoutes('routes/connections.php');
        $this->mapApiRoutes('routes/events.php');
        $this->mapApiRoutes('routes/media.php');
        $this->mapApiRoutes('routes/messages.php');
        $this->mapApiRoutes('routes/places.php');
        $this->mapApiRoutes('routes/profile.php');
        $this->mapApiRoutes('routes/projects.php');
        $this->mapApiRoutes('routes/settings.php');
        $this->mapApiRoutes('routes/sharing.php');
        $this->mapApiRoutes('routes/storage.php');
        $this->mapApiRoutes('routes/topics.php');
        $this->mapApiRoutes('routes/users.php');
        $this->mapApiRoutes('routes/utilities.php');
        $this->mapApiRoutes('routes/test.php');
        // $this->mapWebRoutes('routes/web.php');
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes($path)
    {
        Route::middleware('web')
             ->namespace($this->namespace)
             ->group(base_path($path));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes($path)
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path($path));
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
