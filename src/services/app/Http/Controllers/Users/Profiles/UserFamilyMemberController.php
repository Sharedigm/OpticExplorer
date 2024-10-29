<?php
/******************************************************************************\
|                                                                              |
|                        UserFamilyMemberController.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal family information.          |
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
use App\Models\Users\Profiles\UserFamilyMember;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserFamilyMemberController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's family member.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserFamilyMember
	 */
	public function postCreate(Request $request) {

		// create new user's family member
		//
		$userFamilyMember = new UserFamilyMember([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'name' => $request->input('name'),
			'relationship' => $request->input('relationship')
		]);
		$userFamilyMember->save();

		return $userFamilyMember;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's family member.
	 *
	 * @param string $id - the id of the user family member to get
	 * @return App\Models\Users\Profiles\UserFamilyMember
	 */
	public function getIndex(string $id) {

		// find user's family member by id
		//
		$userFamilyMember = UserFamilyMember::find($id);
		if (!$userFamilyMember) {
			return response("User's family member not found.", 404);
		}

		return $userFamilyMember;
	}

	/**
	 * Get a user's family members.
	 *
	 * @param string $userId - the id of the user to get family members belonging to
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
		return UserFamilyMember::belongingTo($userId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's family member.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user family member to update
	 * @return App\Models\Users\Profiles\UserFamilyMember
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's family member by id
		//
		$userFamilyMember = UserFamilyMember::find($id);
		if (!$userFamilyMember) {
			return response("User's family member not found.", 404);
		}

		// update user's family member
		//
		return $userFamilyMember->change([
			'name' => $request->input('name'),
			'relationship' => $request->input('relationship')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's family member.
	 *
	 * @param string $id - the of the user family member to delete
	 * @return App\Models\Users\Profiles\UserFamilyMember
	 */
	public function deleteIndex(string $id) {

		// find user's family member by id
		//
		$userFamilyMember = UserFamilyMember::find($id);
		if (!$userFamilyMember) {
			return response("User's family member not found.", 404);
		}

		// delete user's family member
		//
		$userFamilyMember->delete();
		return $userFamilyMember;
	}
}
