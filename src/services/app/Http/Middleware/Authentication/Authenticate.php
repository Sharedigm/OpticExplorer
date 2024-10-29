<?php 
/******************************************************************************\
|                                                                              |
|                                Authenticate.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify that the user of a route            |
|        is authenticated.                                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Middleware\Authentication;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\Session;
use App\Models\Users\Auth\UserSession;
use App\Models\Users\Accounts\UserAccount;

class Authenticate
{
	/**
	 * The Guard implementation.
	 *
	 * @var Guard
	 */
	protected $auth;

	//
	// constructor
	//

	/**
	 * Create a new filter instance.
	 *
	 * @param  Guard  $auth
	 * @return void
	 */
	public function __construct(Guard $auth)
	{
		$this->auth = $auth;
	}

	//
	// methods
	//

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		if (UserSession::exists()) {

			// get user account from current session
			//
			$user_id = Session::get('user_id');
			if ($user_id && $request->segment(1) != 'logout') {

				$userAccount = UserAccount::find($user_id);

				// check to see if user is enabled
				//
				if ($userAccount && !$userAccount->isEnabled()) {
					Session::flush();
					return response("User not enabled.", 401);
				}
			} else {
				Session::flush();
				return response("Session invalid.", 401);
			}
		} else {

			// no current session exists
			//
			Session::flush();
			return response("No session.", 401);
		}

		return $next($request);
	}
}
