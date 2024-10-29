<?php
/******************************************************************************\
|                                                                              |
|                           UserEmailAddrController.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal email information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Profiles;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Users\Profiles\UserEmailAddr;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserEmailAddrController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's email addr.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserEmailAddr
	 */
	public function postCreate(Request $request) {

		// create new user's email addr
		//
		$userEmailAddr = new UserEmailAddr([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'email_addr_kind' => $request->input('email_addr_kind'),
			'email_addr' => $request->input('email_addr')
		]);
		$userEmailAddr->save();
		
		return $userEmailAddr;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's email addr.
	 *
	 * @param string $id - the id of the user email addr to get
	 * @return App\Models\Users\Profiles\UserEmailAddr
	 */
	public function getIndex(string $id) {	

		// find user's email addr by id
		//
		$userEmailAddr = UserEmailAddr::find($id);
		if (!$userEmailAddr) {
			return response("User's email address not found.", 404);
		}

		return $userEmailAddr;
	}

	/**
	 * Get user's email addrs.
	 *
	 * @param string $userId - the id of the user to get email addres belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// apply filter
		//
		return UserEmailAddr::belongingTo($userId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's email addr.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user email addr to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's email addr by id
		//
		$userEmailAddr = UserEmailAddr::find($id);
		if (!$userEmailAddr) {
			return response("User's email address not found.", 404);
		}

		// update user's email addr
		//
		return $userEmailAddr->change([
			'email_addr_kind' => $request->input('email_addr_kind'),
			'email_addr' => $request->input('email_addr')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's email addr.
	 *
	 * @param string $id - the if of the user email addr to delete
	 * @return App\Models\Users\Profiles\UserEmailAddr
	 */
	public function deleteIndex(string $id) {

		// find user's email addr by id
		//
		$userEmailAddr = UserEmailAddr::find($id);
		if (!$userEmailAddr) {
			return response("User's email address not found.", 404);
		}

		// delete user's email addr
		//
		$userEmailAddr->delete();
		return $userEmailAddr;
	}
}
