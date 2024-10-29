<?php
/******************************************************************************\
|                                                                              |
|                           GroupMemberController.php                          |
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

use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Users\Connections\Group;
use App\Models\Users\Connections\GroupMember;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class GroupMemberController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new group member.
	 *
	 * @param string $groupId
	 * @param string $userId
	 * @return App\Models\Users\Group
	 */
	public function postCreate(string $groupId, string $userId) {

		// find group by id
		//
		$group = Group::find($groupId);
		if (!$group) {
			return response("Group not found.", 404);
		}

		// find user by id
		//
		$user = User::find($userId);
		if (!$user) {
			return response("User not found.", 404);
		}

		// create new group member
		//
		$groupMember = new GroupMember([
			'id' => Guid::create(),
			'group_id' => $groupId,
			'user_id' => $userId
		]);
		$groupMember->save();

		// return user
		//
		return $user;
	}

	/**
	 * Delete a group member
	 *
	 * @param string $groupId
	 * @param string $userId
	 * @return App\Models\Users\Group
	 */
	public function deleteIndex(string $groupId, string $userId) {

		// find group by id
		//
		$group = Group::find($groupId);
		if (!$group) {
			return response("Group not found.", 404);
		}

		// find user by id
		//
		$user = User::find($userId);
		if (!$user) {
			return response("User not found.", 404);
		}

		// delete group member
		//
		$groupMember = GroupMember::where('group_id', '=', $groupId)
			->where('user_id', '=', $userId)->first();
		$groupMember->delete();

		// return user
		//
		return $user;
	}
}
