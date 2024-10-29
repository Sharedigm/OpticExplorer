<?php

namespace App\Utilities\Session;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;
use App\Http\Filters\FiltersHelper;

/** Code taken from
http://stackoverflow.com/questions/26473106/prevent-sessions-for-routes-in-laravel-custom-on-demand-session-handling#26473856
and https://github.com/laravel/framework/issues/726#issuecomment-52067461
	This class prevents the session cookie from being created by rejecting the
	session before initialization. This prevents both the laravel cookie
	(e.g., 'swamp_csa_session') AND the session id cookie (i.e., the
	40-character random hexadecimal name) from being created.
*/

class SessionRejectServiceProvider extends ServiceProvider
{
	public function register() {
		$me = $this;
		$this->app->bind('session.reject', function($app)use($me){
			return function($request)use($me){
				return call_user_func_array([$me, 'reject'], [$request]);
			};
		});
	}

	// Returning 'true' from this function will set the session.driver to
	// 'array' BEFORE session initialization and before any filter. This
	// prevents session cookies from being sent in the response.
	protected function reject($request) {
		// Routes configured as 'nosession' do not need to set a session cookie
		if (Config::has('app.nosession')) {
			foreach (config('app.nosession') as $pattern) {
				if (is_array($pattern)) {
					if ($request->is(key($pattern))) {
						return in_array($request->method(), current($pattern));
					}
				} else {
					if ($request->is($pattern)) { 
						return true;
					}
				}
			}
		}

		return false;
	}
}