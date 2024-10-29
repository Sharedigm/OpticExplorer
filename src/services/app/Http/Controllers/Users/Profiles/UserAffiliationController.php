<?php
/******************************************************************************\
|                                                                              |
|                        UserAffiliationController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal affiliation information.     |
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
use App\Models\Users\Profiles\User;
use App\Models\Users\Profiles\UserAffiliation;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserAffiliationController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's affiliation.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserAffiliation
	 */
	public function postCreate(Request $request) {

		// create new user's affiliation
		//
		$userAffilation = new UserAffiliation([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'role' => $request->input('role'),
			'organization_name' => $request->input('organization_name'),
			'organization_website' => $request->input('organization_website'),
			'organization_unit' => $request->input('organization_unit'),
			'from_year' => $request->input('from_year'),
			'to_year' => $request->input('to_year'),
		]);
		$userAffilation->save();
		
		return $userAffilation;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's affiliation.
	 *
	 * @param string $id - the id of the user affiliation to get
	 * @return App\Models\Users\Profiles\UserAffiliation
	 */
	public function getIndex(string $id) {

		// find user's affiliation by id
		//
		$userAffiliation = UserAffiliation::find($id);
		if (!$userAffiliation) {
			return response("User's affiliation not found.", 404);
		}

		return $userAffiliation;
	}

	/**
	 * Get user's affiliations.
	 *
	 * @param string $userId - the id of the user to get affiliations belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// apply filter and sort by date
		//
		return UserAffiliation::belongingTo($userId)
			->orderBy('from_year', 'desc')
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's affiliation.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user affilation to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's affiliation by id
		//
		$userAffilation = UserAffiliation::find($id);
		if (!$userAffilation) {
			return response("User's affiliation not found.", 404);
		}

		// update user's affiliation
		//
		return $userAffilation->change([
			'role' => $request->input('role'),
			'organization_name' => $request->input('organization_name'),
			'organization_website' => $request->input('organization_website'),
			'organization_unit' => $request->input('organization_unit'),
			'from_year' => $request->input('from_year'),
			'to_year' => $request->input('to_year')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's affiliation.
	 *
	 * @param string $id - the id of the user affiliation to delete
	 * @return App\Models\Users\Profiles\UserAffiliation
	 */
	public function deleteIndex(string $id) {

		// find user's affiliation by id
		//
		$userAffilation = UserAffiliation::find($id);
		if (!$userAffilation) {
			return response("User's affiliation not found.", 404);
		}

		// delete user's affiliation
		//
		$userAffilation->delete();
		return $userAffilation;
	}
}
