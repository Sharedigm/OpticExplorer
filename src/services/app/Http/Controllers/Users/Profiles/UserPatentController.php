<?php
/******************************************************************************\
|                                                                              |
|                            UserPatentController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' publication information.              |
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
use App\Models\Users\Profiles\UserPatent;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserPatentController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's patent.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserPatent
	 */
	public function postCreate(Request $request) {

		// create new user's patent
		//
		$userPatent = new UserPatent([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),

			// who
			//
			'authors' => $request->input('authors'),

			// what
			//
			'patent_kind' => $request->input('patent_kind'),
			'title' => $request->input('title'),
			'subjects' => $request->input('subjects'),

			// when
			//
			'year' => $request->input('year'),

			// where
			//
			'country' => $request->input('country'),

			// why / how
			//
			'patent_number' => $request->input('patent_number'),
			'url' => $request->input('url')
		]);
		$userPatent->save();
		
		return $userPatent;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's patent.
	 *
	 * @param string $id - the id of the user patent to get
	 * @return App\Models\Users\Profiles\UserPatent
	 */
	public function getIndex(string $id) {

		// find user's patent by id
		//
		$userPatent = UserPatent::find($id);
		if (!$userPatent) {
			return response("User's patent not found.", 404);
		}

		return $userPatent;
	}

	/**
	 * Get user's patents.
	 *
	 * @param string $userId - the id of the user to get patents belonging to
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
		return UserPatent::belongingTo($userId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's patent.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user patent to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's patent by id
		//
		$userPatent = UserPatent::find($id);
		if (!$userPatent) {
			return response("User's patent not found.", 404);
		}

		// update user's patent
		//
		return $userPatent->change([

			// who
			//
			'authors' => $request->input('authors'),

			// what
			//
			'patent_kind' => $request->input('patent_kind'),
			'title' => $request->input('title'),
			'subjects' => $request->input('subjects'),

			// when
			//
			'year' => $request->input('year'),

			// where
			//
			'country' => $request->input('country'),
			
			// why / how
			//
			'patent_number' => $request->input('patent_number'),
			'url' => $request->input('url')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's patent.
	 *
	 * @param string $id - the id of the user patent to delete
	 * @return App\Models\Users\Profiles\UserPatent
	 */
	public function deleteIndex(string $id) {

		// find user's patent by id
		//
		$userPatent = UserPatent::find($id);
		if (!$userPatent) {
			return response("User's patent not found.", 404);
		}

		// delete user's patent
		//
		$userPatent->delete();
		return $userPatent;
	}
}
