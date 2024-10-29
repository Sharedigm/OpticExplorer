<?php 
/******************************************************************************\
|                                                                              |
|                                VerifyConfig.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines middleware to verify that the application has            |
|        been configured.                                                      |
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
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redirect;

class VerifyConfig
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
		if (!File::exists('../.env')) {
			return response("Error - application has not been configured.  No .env file was found.", 500);
		} else {
			return $next($request);
		}
	}

}
