<?php
/******************************************************************************\
|                                                                              |
|                          UserIdentityController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a controller for user identity providers.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Accounts;

use Illuminate\Support\Facades\Session;
use App\Http\Controllers\Controller;
use App\Models\Users\Auth\UserIdentity;

class UserIdentityController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get all user identities by current user.
	 *
	 * @return use App\Models\Users\Auth\UserIdentity[]
	 */
	public function getAll() {
		return UserIdentity::where('user_id', '=', Session::get('user_id'))->get();
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user identity.
	 *
	 * @param string $id - the id of the user identity to delete
	 * @return use App\Models\Users\Auth\UserIdentity
	 */
	public function deleteIndex(string $id) {

		// find user provider by id
		//
		$userIdentity = UserIdentity::find($id);
		if (!$userIdentity) {
			return response("User identity not found.", 404);
		}

		// delete user provider
		//
		$userIdentity->delete();
		return $userIdentity;
	}
}
