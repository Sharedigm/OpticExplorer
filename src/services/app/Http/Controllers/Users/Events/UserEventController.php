<?php
/******************************************************************************\
|                                                                              |
|                            UserEventController.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing user events.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Events;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\Events\UserEvent;
use App\Http\Controllers\Controller;
use App\Http\Filters\DateFilter;
use App\Http\Filters\RangeFilter;
use App\Utilities\Uuids\Guid;

class UserEventController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user event.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Events\UserEvent
	 */
	public function postCreate(Request $request) {

		// create new user event
		//
		$userEvent = new UserEvent([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'name' => $request->input('name'),
			'description' => $request->input('description'),
			'event_date' => $request->input('event_date'),
		]);
		$userEvent->save();

		return $userEvent;
	}

	//
	// querying methods
	//

	/**
	 * Get a user event.
	 *
	 * @param string $id - the id of the user event to get
	 * @return App\Models\Users\Events\UserEvent
	 */
	public function getIndex(string $id) {

		// find user event by id
		//
		$userEvent = UserEvent::find($id);
		if (!$userEvent) {
			return response("User event not found.", 404);
		}

		return $userEvent;
	}

	/**
	 * Get all user events belonging to current user.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Events\UserEvent[]
	 */
	public function getAll(Request $request) {
		
		// get user events of current user
		//
		$query = UserEvent::belongingTo(Session::get('user_id'));

		// parse parameters
		//
		if ($request->has('after')) {
			$after = date($request->input('after'));
			$query = $query->where('event_date', '>=', $after);
		}
		if ($request->has('before')) {
			$before = date($request->input('before'));
			$query = $query->where('event_date', '<=', $before);
		}

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user event.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user event to update
	 * @return App\Models\Users\Events\UserEvent
	 */
	public function updateIndex(Request $request, string $id) {

		// find user event by id
		//
		$userEvent = UserEvent::find($id);
		if (!$userEvent) {
			return response("User event not found.", 404);
		}

		// update attributes
		//
		$userEvent->change([
			'name' => $request->input('name'),
			'description' => $request->input('description'),
			'event_date' => $request->input('event_date')
		]);

		return $userEvent;
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user event.
	 *
	 * @param string $id - the id of the user event to delete
	 * @return App\Models\Users\Events\UserEvent
	 */
	public function deleteIndex(string $id) {

		// find user event by id
		//
		$userEvent = UserEvent::find($id);
		if (!$userEvent) {
			return response("User event not found.", 404);
		}

		// delete user event
		//
		$userEvent->delete();
		
		return $userEvent;
	}
}