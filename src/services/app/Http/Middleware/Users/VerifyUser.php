<?php 
/******************************************************************************\
|                                                                              |
|                                VerifyUser.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify a user.                             |
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
use App\Models\Users\User;
use App\Models\Utilities\Configuration;
use App\Http\Filters\FiltersHelper;

class VerifyUser
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		// get current user
		//
		if (UserSession::exists()) {
			$currentUser = User::current();
		} else {
			return response([
				'status' => 'NO_SESSION',
				'config' => new Configuration()
			], 401);
		}

		// get user
		//
		$userId = $request->route('user_id');
		if ($userId != 'current') {
			$user = User::find($userId);
		} else {
			$user = $currentUser;
		}
		
		// check request by method
		//
		switch (FiltersHelper::method()) {
			case 'post':
				break;

			case 'get':
				if ($user && !$user->isReadableBy($currentUser)) {
					return response("Insufficient priveleges to access user.", 403);
				}
				break;

			case 'put':
			case 'delete':
				if ($user && !$user->isWritableBy($currentUser)) {
					return response("Insufficient priveleges to modify user.", 403);
				}
				break;
		}

		return $next($request);
	}
}