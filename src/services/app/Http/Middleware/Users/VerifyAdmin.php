<?php 
/******************************************************************************\
|                                                                              |
|                               VerifyAdmin.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify an administrator.                   |
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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Http\Filters\FiltersHelper;

class VerifyAdmin {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle(Request $request, Closure $next)
	{
		// check request by method
		//
		switch (FiltersHelper::method()) {
			case 'post':
			case 'get':
			case 'put':
			case 'delete':
				$user = User::current();
				if ((!$user) || (!$user->account->isAdmin())) {
					return response("Unable to access route.  Current user is not an administrator.", 401);
				}
				break;
		}

		return $next($request);
	}

}
