<?php 
/******************************************************************************\
|                                                                              |
|                           VerifyPasswordReset.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify a password reset.                   |
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
use \DateTime;
use \DateTimeZone;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use App\Models\Users\User;
use App\Models\Users\Accounts\PasswordReset;
use App\Http\Filters\FiltersHelper;

class VerifyPasswordReset
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
		// check request by method
		//
		switch (FiltersHelper::method()) {
			case 'post':
			case 'get':
				break;

			case 'put':
				$user = User::current();
				if (!$user) {

					// not logged in
					//
					if ((!$request->has('key')) || (!$request->has('password_reset_id'))) {
						return response("Unable to modify user.", 401);
					}

					// check for password reset
					//
					$passwordResetId = $request->input('password_reset_id');
					$passwordReset = PasswordReset::find($passwordResetId);
					if (!$passwordReset || !Hash::check($request->input('key'), $passwordReset->key)) {
						return response("Unable to modify user.", 401);
					}

					// check for password reset expiration
					//
					$time = new DateTime($passwordReset->created_at, new DateTimeZone('GMT'));
					if ((gmdate('U') - $time->getTimestamp() ) > 1800) {
						return response("Password reset key expired.", 401);
					}
				} else {

					// logged in
					//
					if (($request->has('key')) && ($request->has('password_reset_id'))) {
						break;
					}
					if (!$request->has('user_id')) {
						return response("Unable to modify user.", 500);
					}
					if (!$user->account->isAdmin() && ($request->input('user_id') != $user->id)) {
						return response("Unable to modify user.", 500);
					}
				}
				break;

			case 'delete':
				break;
		}

		return $next($request);
	}
}