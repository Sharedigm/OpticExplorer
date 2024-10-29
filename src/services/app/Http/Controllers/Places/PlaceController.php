<?php
/******************************************************************************\
|                                                                              |
|                              PlaceController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing places.                |
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
use App\Models\Places\Place;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class PlaceController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new place.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Places\Place
	 */
	public function postCreate(Request $request) {

		// create new place
		//
		$place = new Place([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'name' => $request->input('name'),
			'description' => $request->input('description'),
			'latitude' => $request->input('latitude'),
			'longitude' => $request->input('longitude'),
			'zoom_level' => $request->input('zoom_level')
		]);
		$place->save();

		return $place;
	}

	//
	// querying methods
	//

	/**
	 * Get a place.
	 *
	 * @param string $id - the id of the place to get
	 * @return App\Models\Places\Place
	 */
	public function getIndex(string $id) {

		// find place by id
		//
		$place = Place::find($id);
		if (!$place) {
			return response("Place not found.", 404);
		}

		return $place;
	}

	/**
	 * Get all places by the current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getAll() {

		// find places by current user id
		//
		return Place::where('user_id', '=', Session::get('user_id'))->get()->whereNull('path')->values();
	}

	//
	// updating methods
	//

	/**
	 * Update a place.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the place to update
	 * @return App\Models\Places\Place
	 */
	public function updateIndex(Request $request, string $id) {

		// find place by id
		//
		$place = Place::find($id);
		if (!$place) {
			return response("Place not found.", 404);
		}

		// update place attributes
		//
		$place->change([
			'name' => $request->input('name'),
			'description' => $request->input('description'),
			'latitude' => $request->input('latitude'),
			'longitude' => $request->input('longitude'),
			'zoom_level' => $request->input('zoom_level')
		]);

		return $place;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a place.
	 *
	 * @param string $id - the id of the place to delete
	 * @return App\Models\Places\Place
	 */
	public function deleteIndex(string $id) {

		// find place by id
		//
		$place = Place::find($id);
		if (!$place) {
			return response("Place not found.", 404);
		}

		// delete place
		//
		$place->delete();

		return $place;
	}
}