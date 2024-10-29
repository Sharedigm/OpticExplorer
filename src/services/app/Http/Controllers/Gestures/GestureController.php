<?php
/******************************************************************************\
|                                                                              |
|                            GestureController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing gestures.              |
|        (pokes, winks etc)                                                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Gestures;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Gestures\Gesture;
use App\Notifications\GestureNotification;
use App\Http\Controllers\Controller;
use App\Http\Filters\DateFilter;
use App\Http\Filters\RangeFilter;
use App\Utilities\Uuids\Guid;

class GestureController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new gesture.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Gestures\Gesture
	 */
	public function postCreate(Request $request) {

		// find recipient
		//
		$recipient = User::find($request->input('recipient_id'));
		if (!$recipient) {
			return response("Recipient not found.", 404);
		}

		// create new gesture
		//
		$gesture = new Gesture([
			'id' => Guid::create(),
			'kind' => $request->input('kind'),
			'sender_id' => Session::get('user_id'),
			'recipient_id' => $recipient->id
		]);
		$gesture->save();

		// notify recipient of gesture
		//
		$recipient->notify(new GestureNotification([
			'gesture_id' => $gesture->id
		]));

		return $gesture;
	}

	//
	// querying methods
	//

	/**
	 * Get a gesture.
	 *
	 * @param string $id - the id of the gesture to get
	 * @return App\Models\Gestures\Gesture
	 */
	public function getIndex(string $id) {

		// find gesture by id
		//
		$gesture = Gesture::find($id);
		if (!$gesture) {
			return response("Gesture not found.", 404);
		}

		return $gesture;
	}

	//
	// updating methods
	//

	/**
	 * Update a gesture.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the gesture to update
	 * @return App\Models\Gestures\Gesture
	 */
	public function updateIndex(Request $request, string $id) {

		// find gesture by id
		//
		$gesture = Gesture::find($id);
		if (!$gesture) {
			return response("Gesture not found.", 404);
		}

		// update attributes
		//
		$gesture->change([
			'kind' => $request->input('kind')
		]);

		return $gesture;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a gesture.
	 *
	 * @param string $id - the id of the gesture to delete
	 * @return App\Models\Gestures\Gesture
	 */
	public function deleteIndex(string $id) {

		// find gesture by id
		//
		$gesture = Gesture::find($id);
		if (!$gesture) {
			return response("Gesture not found.", 404);
		}

		// delete gesture
		//
		$gesture->delete();
		
		return $gesture;
	}
}