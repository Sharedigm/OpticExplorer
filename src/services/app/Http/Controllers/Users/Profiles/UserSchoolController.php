<?php
/******************************************************************************\
|                                                                              |
|                           UserSchoolController.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal school information.          |
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
use App\Models\Users\Profiles\UserSchool;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserSchoolController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's school.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserSchool
	 */
	public function postCreate(Request $request) {

		// create new user school
		//
		$userSchool = new UserSchool([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'school_name' => $request->input('school_name'),
			'school_website' => $request->input('school_website'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),
			'degree' => $request->input('degree'),
			'from_grade_level' => $request->input('from_grade_level'),
			'to_grade_level' => $request->input('to_grade_level'),
			'from_year' => $request->input('from_year'),
			'to_year' => $request->input('to_year'),
			'major_subject' => $request->input('major_subject'),
			'minor_subject' => $request->input('minor_subject'),
			'sports' => $request->input('sports'),
			'clubs' => $request->input('clubs'),
			'activities' => $request->input('activities'),
			'honors' => $request->input('honors')
		]);
		$userSchool->save();

		return $userSchool;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's school.
	 *
	 * @param string $id - the id of the user school to get
	 * @return App\Models\Users\Profiles\UserSchool
	 */
	public function getIndex(string $id) {

		// find user's school by id
		//
		$userSchool = UserSchool::find($id);
		if (!$userSchool) {
			return response("User's school not found.", 404);
		}

		return $userSchool;
	}

	/**
	 * Get a user's schools.
	 *
	 * @param string $userId - the id of the user to get schools belonging to
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
		return UserSchool::belongingTo($userId)
			->orderBy('from_year', 'desc')
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's school.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user school to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's school by id
		//
		$userSchool = UserSchool::find($id);
		if (!$userSchool) {
			return response("User's school not found.", 404);
		}

		// update user school
		//
		return $userSchool->change([

			// school info
			//
			'school_name' => $request->input('school_name'),
			'school_website' => $request->input('school_website'), 
			'city' => $request->input('city'), 
			'state' => $request->input('state'), 
			'country' => $request->input('country'), 

			// term info
			//
			'degree' => $request->input('degree'),
			'from_grade_level' => $request->input('from_grade_level'), 
			'to_grade_level' => $request->input('to_grade_level'), 
			'from_year' => $request->input('from_year'),
			'to_year' => $request->input('to_year'),
			'major_subject' => $request->input('major_subject'),
			'minor_subject' => $request->input('minor_subject'),

			// extracurricular info
			//
			'sports' => $request->input('sports'),
			'clubs' => $request->input('clubs'),
			'activities' => $request->input('activities'),
			'honors' => $request->input('honors')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's school.
	 *
	 * @param string $id - the id of the user school to delete
	 * @return App\Models\Users\Profiles\UserSchool
	 */
	public function deleteIndex(string $id) {

		// find user's school by id
		//
		$userSchool = UserSchool::find($id);
		if (!$userSchool) {
			return response("User's school not found.", 404);
		}

		// delete user's school
		//
		$userSchool->delete();
		return $userSchool;
	}
}
