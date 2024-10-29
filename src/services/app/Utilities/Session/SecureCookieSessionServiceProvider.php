<?php

namespace App\Utilities\Session;

use Illuminate\Support\ServiceProvider;
use App\Utilities\Session\SecureCookieSessionHandler;

class SecureCookieSessionServiceProvider extends ServiceProvider
{
    public function register() {
		$manager = $this->app['session'];
        $manager->extend('secure_cookie', function(){
            return new SecureCookieSessionHandler( $this->app['cookie'], config('session.lifetime') );
        });
    }
}

