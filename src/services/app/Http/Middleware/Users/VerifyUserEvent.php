<?php 
/******************************************************************************\
|                                                                              |
|                              VerifyUserEvent.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify a user (calendar) event.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Middleware\Users;

use Closure;
use App\Models\Users\Auth\UserSession;
use App\Http\Filters\FiltersHelper;

class VerifyUserEvent
{
	/**
	 * Handle an incoming request.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param \Closure $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		// check request by method
		//
		switch (FiltersHelper::method()) {
			case 'post':
				if (!UserSession::exists()) {
					return response("No session.", 401);
				} 
				break;

			case 'get':
				break;

			case 'put':
			case 'delete':
				if (!UserSession::exists()) {
					return response("No session.", 401);
				} 
				break;
		}

		return $next($request);
	}
}