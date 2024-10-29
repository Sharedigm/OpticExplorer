<?php
/******************************************************************************\
|                                                                              |
|                              UserController.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' authentication information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use App\Models\Users\User;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Users\Profiles\UserProfile;
use App\Models\Users\Accounts\PasswordReset;
use App\Models\Users\Connections\ConnectionRequest;
use App\Models\Users\Sharing\UserInvitation;
use App\Models\Users\Storage\UserStorage;
use App\Models\Storage\Directory;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;
use App\Http\Filters\DateFilter;
use App\Http\Filters\LimitFilter;

class UserController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\User
	 */
	public function postCreate(Request $request) {

		// create new user
		//
		$user = new User([
			'id' => Guid::create(),
			'first_name' => $request->input('first_name'),
			'preferred_name' => $request->input('preferred_name'),
			'middle_name' => $request->input('middle_name'),
			'last_name' => $request->input('last_name')
		]);

		// create new user profile
		//
		$userProfile = new UserProfile([
			'user_id' => $user->id
		]);

		// create new user account
		//
		$userAccount = new UserAccount([
			'user_id' => $user->id,
			'username' => $request->input('username'),
			'password' => $request->input('password'),
			'enabled_flag' => 1,
			'email' => $request->input('email'),
			'email_verified_flag' => 0,
			'admin_flag' => 0,
		]);

		// check if user account is valid (if username
		// and email address are not already taken).
		//
		$errors = [];
		if (!$userAccount->isTaken($errors)) {
			return response(json_encode($errors), 409);
		}

		// add new user
		//
		$user->save();
		$userProfile->save();
		$userAccount->add();

		// add inviter as connection
		//
		if ($request->has('user_invitation_id')) {
			$userInvitationId = $request->input('user_invitation_id');

			// find user invitation by id
			//
			$userInvitation = UserInvitation::find($userInvitationId);

			// accept invitation
			//
			if ($userInvitation) {
				$user->acceptInvitation($userInvitation);

				// add inviter disk quota bonus
				//
				$inviter = $userInvitation->inviter;
				if ($inviter) {
					$inviter->account->incrementDiskQuota(config('app.invitation_disk_quota_bonus'));
				}
			}
		}

		// create user storage
		//
		if ($request->has('key')) {

			// create remote user storage
			//
			$userStorage = new UserStorage([
				'id' => Guid::create(),
				'user_id' => $user->id,
				'host' => $request->input('host'),
				'key' => $request->input('key'),
				'secret' => $request->input('secret'),
				'region' => $request->input('region'),
				'bucket' => $request->input('bucket')
			]);
			$userStorage->save();
		} else {

			// create default folders in local storage
			//
			$userAccount->createDefaultFolders();
		}

		return $user;
	}

	//
	// querying methods
	//

	/**
	 * Get a user.
	 *
	 * @param string $id - the id of the user to get
	 * @return App\Models\Users\User
	 */
	public function getIndex(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}
		
		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get a user by username.
	 *
	 * @param string $username - the username of the user to get
	 * @return App\Models\Users\User
	 */
	public function getByUsername(string $username) {

		// get user's account
		//
		$userAccount = UserAccount::byUsername($username)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the username: " . $username, 404);
		}

		// find user by id
		//
		$user = User::find($userAccount->user_id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get a user by email address.
	 *
	 * @param string $email - the email of the user to get
	 * @return App\Models\Users\User
	 */
	public function getByEmail(string $email) {

		// get user's account
		//
		$userAccount = UserAccount::byEmail($email)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the email address: " . $email, 404);
		}

		// find user by id
		//
		$user = User::find($userAccount->user_id);
		if (!$user) {
			return response("User not found.", 404);
		}

		return $user;
	}

	/**
	 * Get all users.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getAll() {

		// create query
		//
		$query = User::orderBy('created_at', 'DESC');

		// apply filters
		//
		$query = DateFilter::applyTo($request, $query);
		$query = LimitFilter::applyTo($request, $query);

		// perform query
		//
		return $query->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		// update user
		//
		return $user->change([
			'honorific' => $request->input('honorific'),
			'first_name' => $request->input('first_name'),
			'preferred_name' => $request->input('preferred_name'),
			'middle_name' => $request->input('middle_name'),
			'last_name' => $request->input('last_name'),
			'titles' => $request->input('titles')
		]);
	}

	/**
	 * Update all users.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\User[]
	 */
	public function updateAll(Request $request) {

		// get params
		//
		$input = $request->all();

		// update all users
		//
		$collection = collect();
		for ($i = 0; $i < sizeOf($input); $i++) {
			UsersController::updateIndex($item[$i]['id']);	
		}
		return $collection;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user.
	 *
	 * @param string $id - the id of the user to delete
	 * @return App\Models\Users\User
	 */
	public function deleteIndex(string $id) {

		// get current user id
		//
		if ($id == 'current') {
			$id = Session::get('user_id');
		}

		// find user by id
		//
		$user = User::find($id);
		if (!$user) {
			return response("User not found.", 404);
		}

		// check permissions
		//
		if (!$user->isWritableBy(User::current())) {
			return response("You do not have permission to delete this user.", 400);
		}

		// delete user from database and file system
		//
		$user->delete();

		// destroy session cookies
		//
		Session::flush();

		return $user;
	}

	//
	// private filtering methods
	//

	/**
	 * Filter users by after date.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param object $items[] - the items to filter
	 * @return object[]
	 */
	private static function filterByAfterDate(Request $request, array $items) {
		$after = $request->input('after');
		if ($after != null && $after != '') {
			$afterDate = new \DateTime($after);
			$afterDate->setTime(0, 0);
			/*
			$items = $items->filter(function($item) use ($afterDate) {
				if ($item->created_at != null) {
			    	return $item->created_at->getTimestamp() >= $afterDate->getTimestamp();
			    }
			});
			*/
			$filteredItems = collect();
			foreach ($items as $item) {
				if ($item->created_at != null) {
					$createDate = new \DateTime($item->created_at);
					if ($createDate->getTimestamp() >= $afterDate->getTimestamp()) {
						$filteredItems->push($item);
					}
				}
			}
			$items = $filteredItems;
		}
		return $items;
	}

	/**
	 * Filter users by before date.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param object $items[] - the items to filter
	 * @return object[]
	 */
	private static function filterByBeforeDate(Request $request, array $items) {
		$before = $request->input('before');
		if ($before != null && $before != '') {
			$beforeDate = new \DateTime($before);
			$beforeDate->setTime(0, 0);
			/*
			$items = $items->filter(function($item) use ($beforeDate) {
				if ($item->created_at != null) {
			    	return $item->created_at->getTimestamp() <= $beforeDate->getTimestamp();
				}
			});
			*/
			$filteredItems = collect();
			foreach ($items as $item) {
				if ($item->created_at != null) {
					$createDate = new \DateTime($item->created_at);
					if ($createDate->getTimestamp() <= $beforeDate->getTimestamp()) {
						$filteredItems->push($item);
					}
				}
			}
			$items = $filteredItems;
		}
		return $items;
	}

	/**
	 * Filter users by after and before date.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param object $items[] - the items to filter
	 * @return object[]
	 */
	private static function filterByDate(Request $request, array $items) {
		$items = self::filterByAfterDate($request, $items);
		$items = self::filterByBeforeDate($request, $items);
		return $items;
	}
}