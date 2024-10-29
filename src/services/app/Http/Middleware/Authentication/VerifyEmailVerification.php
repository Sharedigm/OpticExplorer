<?php 
/******************************************************************************\
|                                                                              |
|                           VerifyEmailVerification.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify an email verification.              |
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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\Accounts\EmailVerification;
use App\Http\Filters\FiltersHelper;

class VerifyEmailVerification
{
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
				break;

			case 'get':
			case 'delete':
				$id = $request->segment(3);
				$emailVerification = EmailVerification::find($id);
				if (!$emailVerification) {
					return response("Email verification not found.", 404);
				}
				break;
		}

		return $next($request);
	}
}