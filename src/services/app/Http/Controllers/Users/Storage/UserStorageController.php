<?php
/******************************************************************************\
|                                                                              |
|                           UserStorageController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users's personal account information.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Storage;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\Storage\UserStorage;
use App\Http\Controllers\Controller;

class UserStorageController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get the current user's storage.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function getCurrent(Request $request) {

		// get current user id
		//
		$userId = Session::get('user_id');
		if (!$userId) {
			return response("No session.", 401);
		}

		// get current user storage
		//
		return UserStorage::where('user_id', '=', $userId)->first();
	}

	//
	// updating methods
	//

	/**
	 * Update the current user's storage.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// get current user storage
		//
		$userStorage = UserStorage::where('id', '=', $id)->first();

		// parse parameters
		//	
		$host = $request->input('host');
		$key = $request->input('key');
		$secret = $request->input('secret');
		$region = $request->input('region');
		$bucket = $request->input('bucket');

		// update attributes
		//
		$userStorage->change([
			'host' => $host,
			'key' => $key,
			'secret' => $secret,
			'region' => $region,
			'bucket' => $bucket
		]);

		return $userStorage;
	}
}