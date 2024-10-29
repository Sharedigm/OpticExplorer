<?php
/******************************************************************************\
|                                                                              |
|                             UserPhoneController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal phone information.           |
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
use App\Models\Users\Profiles\UserPhone;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserPhoneController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's phone.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserPhone
	 */
	public function postCreate(Request $request) {

		// create new user's phone
		//
		$userPhone = new UserPhone([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'phone_kind' => $request->input('phone_kind'),
			'country_code' => $request->input('country_code'),
			'area_code' => $request->input('area_code'),
			'phone_number' => $request->input('phone_number')
		]);
		$userPhone->save();

		return $userPhone;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's phone.
	 *
	 * @param string $id - the id of the user phone to get
	 * @return App\Models\Users\Profiles\UserPhone
	 */
	public function getIndex(string $id) {

		// find user's phone by id
		//	
		$userPhone = UserPhone::find($id);
		if (!$userPhone) {
			return response("User's phone not found.", 404);
		}

		return $userPhone;
	}

	/**
	 * Get a user's phones.
	 *
	 * @param string $userId - the id of the user to get phones belonging to
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
		return UserPhone::belongingTo($userId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's phone.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user phone to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's phone by id
		//
		$userPhone = UserPhone::find($id);
		if (!$userPhone) {
			return response("User's phone not found.", 404);
		}

		// update user's phone
		//
		return $userPhone->change([
			'phone_kind' => $request->input('phone_kind'),
			'country_code' => $request->input('country_code'),
			'area_code' => $request->input('area_code'),
			'phone_number' => $request->input('phone_number')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's phone.
	 *
	 * @param string $id - the id of the user phone to delete
	 * @return App\Models\Users\Profiles\UserPhone
	 */
	public function deleteIndex(string $id) {

		// find user's phone by id
		//
		$userPhone = UserPhone::find($id);
		if (!$userPhone) {
			return response("User's phone not found.", 404);
		}

		// delete user's phone
		//
		$userPhone->delete();
		return $userPhone;
	}
}
