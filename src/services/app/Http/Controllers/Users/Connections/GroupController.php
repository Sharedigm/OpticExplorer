<?php
/******************************************************************************\
|                                                                              |
|                              GroupController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a controller for manipulating user groups.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Connections;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\Connections\Group;
use App\Models\Users\Connections\GroupMember;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class GroupController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new group.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Group
	 */
	public function postCreate(Request $request) {

		// create new group
		//
		$group = new Group([
			'id' => Guid::create(),
			'name' => $request->input('name'),
			'icon_path' => $request->input('icon_path'),
			'user_id' => Session::get('user_id')
		]);
		$group->save();
		
		return $group;
	}

	//
	// querying methods
	//

	/**
	 * Get a group by id.
	 *
	 * @param string $id - the id of the group to get
	 * @return App\Models\Users\Group
	 */
	public function getIndex(string $id) {

		// find group by id
		//
		$group = Group::find($id);
		if (!$group) {
			return response("Group not found.", 404);
		}

		return $group;
	}

	/**
	 * Get a user's groups by user id.
	 *
	 * @param string $userId - the id of the user to get groups belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get groups belonging to user
		//
		return Group::where('user_id', '=', $userId)->get();
	}


	//
	// updating methods
	//

	/**
	 * Update a group by id
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the group to update
	 * @return App\Models\Users\Group
	 */
	public function updateIndex(Request $request, string $id) {

		// find group by id
		//
		$group = Group::find($id);
		if (!$group) {
			return response("Group not found.", 404);
		}

		// return changes
		//
		return $group->change([
			'name' => $request->input('name'),
			'icon_path' => $request->input('icon_path')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a group by id.
	 *
	 * @param string $id - the id of the group to delete
	 * @return App\Models\Users\Group
	 */
	public function deleteIndex(string $id) {

		// find group by id
		//
		$group = Group::find($id);
		if (!$group) {
			return response("Group not found.", 404);
		}

		// delete all group members
		//
		GroupMember::where('group_id', '=', $id)->delete();

		// delete group
		//
		$group->delete();
		return $group;
	}
}
