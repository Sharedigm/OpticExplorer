<?php
/******************************************************************************\
|                                                                              |
|                             SessionController.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' session information.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use App\Models\Users\Auth\UserSession;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Utilities\Configuration;
use App\Http\Controllers\Controller;
use App\Utilities\Security\Password;

class SessionController extends Controller
{
	//
	// creating methods
	//
	
	/**
	 * Create a new session.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\User
	 */
	public function postLogin(Request $request) {

		// get input parameters
		//
		$username = $request->input('username');
		$password = $request->input('password');

		// validate user account
		//
		$userAccount = UserAccount::where('username', '=', $username)->first();
		if ($userAccount) {
			if (Password::isValid($password, $userAccount->password)) {
				
				// check for user associated with this account
				//
				if (!$userAccount->user) {
					return response("User not found: " . $userAccount->user_id, 404);
				}
				if (config('mail.enabled') && !$userAccount->hasBeenVerified()) {
					return response("User email has not been verified.", 401);
				}
				if (!$userAccount->isEnabled()) {
					return response("User has not been approved.", 401);
				}

				// create new session
				//
				$request->session()->regenerate();

				// set session info
				//
				session([
					'user_id' => $userAccount->user_id,
					'timestamp' => time()
				]);

				// set user id in database
				//
				/*
				if (config('session.driver') == 'database') {
					$sessionId = request()->session()->getId();
					$session = UserSession::find($sessionId);
					$session->user_id = $userAccount->user_id;
					$session->save();
				}
				*/

				// set logged in flag
				//
				$userAccount->logged_in = true;

				// update login dates
				//
				$userAccount->updateLoginDates();

				return $userAccount->user;
			} else {
				return response("Incorrect username or password.", 401);
			}
		} else {
			return response("Incorrect username or password.", 401);
		}
	}

	/**
	 * Update a user's timestamps.
	 *
	 */
	public function putStart() {

		// find user by id
		//
		$userAccount = UserAccount::current();

		// update login dates
		//
		if ($userAccount) {
			$userAccount->updateLoginDates();
			$userAccount->updateLoginDates();
		}
		
		return $userAccount->ultimate_login_at;
	}

	//
	// querying methods
	//

	/**
	 * Get a session.
	 *
	 * @param $sessionId - the id of the session to get
	 * @return App\Models\Users\Auth\UserSession
	 */
	public function getIndex(string $sessionId) {
		if ($sessionId == 'current') {
			return UserSession::current();
		}
	}

	/**
	 * Find if a user is logged in.
	 *
	 * @param $userId - the id of the user to query
	 * @return bool
	 */
	public function isLoggedIn($userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// find user account by id
		//
		$userAccount = UserAccount::find($userId);

		// return if user is logged in to account
		//
		return $userAccount && $userAccount->logged_in;
	}

	/**
	 * Find if a session is valid.
	 *
	 * @param $sessionId - the id of the session to query
	 * @return bool
	 */
	public function isValid($sessionId) {
		return $_COOKIE != null;
	}

	//
	// deleting methods
	//

	/**
	 * Delete current session.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function postLogout() {
		if (UserSession::exists()) {

			// get current user
			//
			$userAccount = UserAccount::current();
			if ($userAccount) {

				// set logged in flag
				//
				$userAccount->logged_in = false;
				$userAccount->save();

				// expire cookie
				//
				// setcookie(config('session.cookie'), "", time()-3600, '/');
				// unset($_COOKIE[Session::getId()]);

				// destroy session cookies
				//
				Session::flush();

				// return response
				//	
				return response("SESSION_DESTROYED");
			}
		}
	}
}
