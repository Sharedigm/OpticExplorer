<?php
/******************************************************************************\
|                                                                              |
|                            UserAddressController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal address information.         |
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
use App\Models\Users\Profiles\UserAddress;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserAddressController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's address.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserAddress
	 */
	public function postCreate(Request $request) {

		// create new user's address
		//
		$userAddress = new UserAddress([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'address_kind' => $request->input('address_kind'),
			'street_address' => $request->input('street_address'),
			'apartment' => $request->input('apartment'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'postal_code' => $request->input('postal_code'),
			'country' => $request->input('country')
		]);
		$userAddress->save();
		
		return $userAddress;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's address.
	 *
	 * @param string $id - the id of the user address to get
	 * @return App\Models\Users\Profiles\UserAddress
	 */
	public function getIndex(string $id) {

		// find user's address by id
		//
		$userAddress = UserAddress::find($id);
		if (!$userAddress) {
			return response("User's address not found.", 404);
		}

		return $userAddress;
	}

	/**
	 * Get user's addresses.
	 *
	 * @param string $userId - the id of the user to get addresses belonging to
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
		return UserAddress::belongingTo($userId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's address.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user address to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's address by id
		//
		$userAddress = UserAddress::find($id);
		if (!$userAddress) {
			return response("User's address not found.", 404);
		}

		// update user's address
		//
		return $userAddress->change([
			'address_kind' => $request->input('addresss_kind'),
			'street_address' => $request->input('street_address'),
			'apartment' => $request->input('apartment'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'postal_code' => $request->input('postal_code'),
			'country' => $request->input('country')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's address.
	 *
	 * @param string $id - the id of the user address to delete
	 * @return App\Models\Users\Profiles\UserAddress
	 */
	public function deleteIndex(string $id) {

		// find user's address by id
		//
		$userAddress = UserAddress::find($id);
		if (!$userAddress) {
			return response("User's address not found.", 404);
		}

		// delete user's address
		//
		$userAddress->delete();
		return $userAddress;
	}
}
