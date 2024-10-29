<?php
/******************************************************************************\
|                                                                              |
|                       ConnectionRequestController.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for user connection requests.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Connections;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Users\User;
use App\Models\Users\Connections\ConnectionRequest;
use App\Http\Controllers\Controller;
use App\Http\Filters\RangeFilter;
use App\Utilities\Uuids\Guid;

class ConnectionRequestController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new connection request.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest
	 */
	public function postCreate(Request $request) {

		// create connection request
		//
		$connectionRequest = new ConnectionRequest([
			'id' => Guid::create(),
			'user_id' => $request->input('user_id'),
			'connection_id' => $request->input('connection_id'),
			'message' => $request->input('message')
		]);
		$connectionRequest->save();

		return $connectionRequest;
	}

	//
	// querying methods
	//

	/**
	 * Get a connection request.
	 *
	 * @param string $id - the id of the connection request to get
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest
	 */
	public function getIndex(string $id) {

		// find connection request by id
		//
		$connectionRequest = ConnectionRequest::find($id);
		if (!$connectionRequest) {
			return response("Connection request not found.", 404);
		}

		return $connectionRequest;
	}

	/**
	 * Get a user's received connection requests.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get connection requests received by
	 * @return Illuminate\Support\Collection
	 */
	public function getReceivedByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get connection requests receieved by user
		//
		$query = ConnectionRequest::receivedBy($userId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get a user's pending received connection requests.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get pending connection requests of
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest[]
	 */
	public function getPendingReceivedByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get connection requests received by user
		//
		$query = ConnectionRequest::receivedBy($userId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get()
			->filter(function($item) {
				return $item->status() == 'pending';
			})
			->values();
	}

	/**
	 * Get a user's sent connection requests.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get connection requests sent by
	 * @return Illuminate\Support\Collection
	 */
	public function getSentByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get connection requests receieved by user
		//
		$query = ConnectionRequest::sentBy($userId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get();
	}

	/**
	 * Get a user's pending sent connection requests.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get pending connection requests sent by
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest[]
	 */
	public function getPendingSentByUser(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get connection requests receieved by user
		//
		$query = ConnectionRequest::sentBy($userId);

		// apply filter and sort
		//
		return RangeFilter::applyTo($request, $query)
			->orderBy('created_at', 'DESC')
			->get()
			->filter(function($item) {
				return $item->status() == 'pending';
			})
			->values();
	}

	//
	// updating methods
	//

	/**
	 * Accept a connection request.
	 *
	 * @param string $id - the id of the connection request to accept
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest
	 */
	public function acceptIndex(string $id) {

		// find connection request by id
		//
		$connectionRequest = ConnectionRequest::find($id);
		if (!$connectionRequest) {
			return response("Connection request not found.", 404);
		}

		// accept connection request
		//
		$connectionRequest->accept();
		return $connectionRequest;	
	}

	/**
	 * Decline a connection request.
	 *
	 * @param string $id - the id of the connection request to decline
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest
	 */
	public function declineIndex(string $id) {

		// find connection request by id
		//
		$connectionRequest = ConnectionRequest::find($id);
		if (!$connectionRequest) {
			return response("Connection request not found.", 404);
		}

		// decline connection request
		//
		$connectionRequest->decline();
		return $connectionRequest;	
	}

	//
	// deleting methods
	//

	/**
	 * Delete a connection request.
	 *
	 * @param string $id - the id of the connection request to delete
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest
	 */
	public function deleteIndex(string $id) {

		// find connection request by id
		//
		$connectionRequest = ConnectionRequest::find($id);
		if (!$connectionRequest) {
			return response("Connection request not found.", 404);
		}

		// delete connection request
		//
		$connectionRequest->delete();
		return $connectionRequest;
	}
}
