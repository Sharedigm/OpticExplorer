<?php
/******************************************************************************\
|                                                                              |
|                            CheckInController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing check-ins.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Places;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\Places\CheckIn;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class CheckInController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new check-in.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Places\CheckIn
	 */
	public function postCreate(Request $request) {

		// remove previous check-ins from current user
		//
		CheckIn::where('user_id', '=', Session::get('user_id'))->delete();

		// create new check-in
		//
		$checkIn = new CheckIn([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'name' => $request->input('name'),
			'description' => $request->input('description'),
			'latitude' => $request->input('latitude'),
			'longitude' => $request->input('longitude'),
			'zoom_level' => $request->input('zoom_level')
		]);
		$checkIn->save();

		return $checkIn;
	}

	//
	// querying methods
	//

	/**
	 * Get a check-in.
	 *
	 * @param string $id - the id of the check-in to get
	 * @return App\Models\Places\CheckIn
	 */
	public function getIndex(string $id) {

		// find check-in by id
		//
		$checkIn = CheckIn::find($id);
		if (!$checkIn) {
			return response("Check-in not found.", 404);
		}

		return $checkIn;
	}

	/**
	 * Get all check-ins by the current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getAll() {

		// get check-ins by current user id
		//
		return CheckIn::where('user_id', '=', Session::get('user_id'))->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a check-in.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the check-in to update
	 * @return App\Models\Places\CheckIn
	 */
	public function updateIndex(Request $request, string $id) {

		// find check-in by id
		//
		$checkIn = CheckIn::find($id);
		if (!$checkIn) {
			return response("Check-in not found.", 404);
		}

		// update check-in attributes
		//
		$checkIn->change([
			'name' => $request->input('name'),
			'description' => $request->input('description'),
			'latitude' => $request->input('latitude'),
			'longitude' => $request->input('longitude'),
			'zoom_level' => $request->input('zoom_level')
		]);

		return $checkIn;
	}

	/**
	 * Update a check-in.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the check-in to update
	 * @return App\Models\Places\CheckIn
	 */
	public function checkOutIndex(Request $request, string $id) {

		// find check-in by id
		//
		$checkIn = CheckIn::find($id);
		if (!$checkIn) {
			return response("Check-in not found.", 404);
		}

		// update check-in attributes
		//
		$checkIn->checkOut();

		return $checkIn;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a check-in.
	 *
	 * @param string $id - the id of the check-in to delete
	 * @return App\Models\Places\CheckIn
	 */
	public function deleteIndex(string $id) {

		// find check-in by id
		//
		$checkIn = CheckIn::find($id);
		if (!$checkIn) {
			return response("Check-in not found.", 404);
		}

		// delete check-in
		//
		$checkIn->delete();

		return $checkIn;
	}
}