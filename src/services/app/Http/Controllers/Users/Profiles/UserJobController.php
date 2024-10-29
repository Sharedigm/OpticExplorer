<?php
/******************************************************************************\
|                                                                              |
|                             UserJobController.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal job information.             |
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
use App\Models\Users\Profiles\UserJob;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserJobController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's job.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserJob
	 */
	public function postCreate(Request $request) {

		// create new user's job
		//
		$userJob = new UserJob([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),

			// who
			//
			'company_name' => $request->input('company_name'),
			'company_website' => $request->input('company_website'),
			'division' => $request->input('division'),

			// what
			//
			'title' => $request->input('title'),
			'description' => $request->input('description'),

			// when
			//
			'from_date' => $request->input('from_date'),
			'to_date' => $request->input('to_date'),

			// where
			//
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),
			
			// why / how
			//
			'achievements' => $request->input('achievements'),
			'awards' => $request->input('awards'),
			'skills' => $request->input('skills'),
		]);
		$userJob->save();

		return $userJob;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's job.
	 *
	 * @param string $id - the id of the user job to get
	 * @return App\Models\Users\Profiles\UserHome
	 */
	public function getIndex(string $id) {

		// find user's job by id
		//
		$userJob = UserJob::find($id);
		if (!$userJob) {
			return response("User's job not found.", 404);
		}

		return $userJob;
	}

	/**
	 * Get a user's jobs.
	 *
	 * @param string $userId - the id of the user to get jobs belonging to
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
		return UserJob::belongingTo($userId)
			->orderBy('from_date', 'desc')
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's job.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user job to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's job by id
		//
		$userJob = UserJob::find($id);
		if (!$userJob) {
			return response("User's job not found.", 404);
		}

		// update user's job
		//
		return $userJob->change([

			// who
			//
			'company_name' => $request->input('company_name'),
			'company_website' => $request->input('company_website'),
			'division' => $request->input('division'),

			// what
			//
			'title' => $request->input('title'),
			'description' => $request->input('description'),

			// when
			//
			'from_date' => $request->input('from_date'),
			'to_date' => $request->input('to_date'),

			// where
			//
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),
			
			// why / how
			//
			'achievements' => $request->input('achievements'),
			'awards' => $request->input('awards'),
			'skills' => $request->input('skills'),
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's job.
	 *
	 * @param string $id - the id of the user job to delete
	 * @return App\Models\Users\Profiles\UserJob
	 */
	public function deleteIndex(string $id) {

		// find user's job by id
		//
		$userJob = UserJob::find($id);
		if (!$userJob) {
			return response("User's job not found.", 404);
		}

		// delete user's job
		//
		$userJob->delete();
		return $userJob;
	}
}
