<?php
/******************************************************************************\
|                                                                              |
|                             UserHomeController.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal home information.            |
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
use App\Models\Users\Profiles\UserHome;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserHomeController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's home.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserHome
	 */
	public function postCreate(Request $request) {

		// create new user's home
		//
		$userHome = new UserHome([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),

			// location info
			//
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),

			// time info
			//
			'from_year' => $request->input('from_year'),
			'to_year' => $request->input('to_year')
		]);
		$userHome->save();

		return $userHome;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's home.
	 *
	 * @param string $id - the id of the user home to get
	 * @return App\Models\Users\Profiles\UserHome
	 */
	public function getIndex(string $id) {

		// find user's home by id
		//	
		$userHome = UserHome::find($id);
		if (!$userHome) {
			return response("User's home not found.", 404);
		}

		return $userHome;
	}

	/**
	 * Get a user's homes.
	 *
	 * @param string $userId - the id of the user to get homes belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// apply filter and sort by year
		//
		return UserHome::belongingTo($userId)
			->orderBy('from_year', 'desc')
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's home.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user home to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's home by id
		//
		$userHome = UserHome::find($id);
		if (!$userHome) {
			return response("User's home not found.", 404);
		}

		// update user's home
		//
		return $userHome->change([

			// location info
			//
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),

			// time info
			//
			'from_year' => intval($request->input('from_year')),
			'to_year' => intval($request->input('to_year'))
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's home.
	 *
	 * @param string $id - the id of the user home to delete
	 * @return App\Models\Users\Profiles\UserHome
	 */
	public function deleteIndex(string $id) {

		// find user's home by id
		//
		$userHome = UserHome::find($id);
		if (!$userHome) {
			return response("User's home not found.", 404);
		}

		// delete user's home
		//
		$userHome->delete();
		return $userHome;
	}
}
