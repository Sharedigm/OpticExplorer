<?php
/******************************************************************************\
|                                                                              |
|                              ShareController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for managing shared items.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Storage\Sharing;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Storage\Sharing\Share;
use App\Http\Controllers\Controller;
use App\Http\Filters\RangeFilter;

class ShareController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get a share.
	 *
	 * @param string $id - the id of the share to get
	 * @return App\Models\Storage\Sharing\Share
	 */
	public function getIndex(string $id) {

		// find share by id
		//
		$share = Share::find($id);
		if (!$share) {
			return response("Share not found.", 404);
		}

		return $share;
	}

	/**
	 * Get a user's shares.
	 *
	 * @param string $userId - the id of the user to get shares belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user's shares
		//
		$query = Share::belongingTo($userId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get shares by owner.
	 *
	 * @param string $ownerId - the id of the owner to get shares owned by
	 * @return Illuminate\Support\Collection
	 */
	public function getByOwner(string $ownerId) {

		// find current owner
		//
		if ($ownerId == 'current') {
			$ownerId = Session::get('user_id');
		}

		// find owner by id
		//
		$owner = User::find($ownerId);
		if (!$owner) {
			return response("Owner not found.", 404);
		}

		// get owner's shares
		//
		$query = Share::ownedBy($ownerId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	//
	// deleting methods
	//

	/**
	 * Delete a share.
	 *
	 * @param string $id - the id of the share to delete
	 * @return App\Models\Storage\Sharing\Share
	 */
	public function deleteIndex(string $id) {

		// find share by id
		//
		$share = Share::find($id);
		if (!$share) {
			return response("Share not found.", 404);
		}

		// delete share
		//
		$share->delete();
		return $share;
	}
}
