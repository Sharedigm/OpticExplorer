<?php
/******************************************************************************\
|                                                                              |
|                           UserWebsiteController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal website information.         |
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
use App\Models\Users\Profiles\UserWebsite;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserWebsiteController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's website.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserWebsite
	 */
	public function postCreate(Request $request) {

		// create new user website
		//
		$userWebsite = new UserWebsite([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'url' => $request->input('url'),
			'website_kind' => $request->input('website_kind'),
			'order' => $request->input('order')
		]);
		$userWebsite->save();

		return $userWebsite;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's website.
	 *
	 * @param string $id - the id of the user website to get
	 * @return App\Models\Users\Profiles\UserWebsite
	 */
	public function getIndex(string $id) {

		// find user's website by id
		//
		$userWebsite = UserWebsite::find($id);
		if (!$userWebsite) {
			return response("User's website not found.", 404);
		}

		return $userWebsite;
	}

	/**
	 * Get a user's websites.
	 *
	 * @param string $userId - the id of the user to get websites belonging to
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// apply filter and sort
		//
		return UserWebsite::belongingTo($userId)
			->orderBy('order')
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's website.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user website to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's website by id
		//
		$userWebsite = UserWebsite::find($id);
		if (!$userWebsite) {
			return response("User's website not found.", 404);
		}

		// update user website
		//
		return $userWebsite->change([

			// company info
			//
			'user_id' => $request->input('user_id'),
			'url' => $request->input('url'),
			'website_kind' => $request->input('website_kind'),
			'order' => $request->input('order')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's website.
	 *
	 * @param string $id - the id of the user website to delete
	 * @return App\Models\Users\Profiles\UserWebsite
	 */
	public function deleteIndex(string $id) {

		// find user's website by id
		//
		$userWebsite = UserWebsite::find($id);
		if (!$userWebsite) {
			return response("User's website not found.", 404);
		}

		// delete user's website
		//
		$userWebsite->delete();
		return $userWebsite;
	}
}
