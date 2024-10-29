<?php
/******************************************************************************\
|                                                                              |
|                           ConnectionController.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for managing users' connections.                 |
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
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Response;
use App\Models\Users\User;
use App\Models\Users\Connections\ConnectionRequest;
use App\Http\Controllers\Controller;

class ConnectionController extends Controller
{
	//
	// get methods
	//

	/**
	 * Get connected users.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getConnected(Request $request) {
		return $this->getConnectionsByIndex($request, Session::get('user_id'));
	}

	/**
	 * Get unconnected users.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to find strangers of
	 * @return App\Models\Users\User[]
	 */
	public function getUnconnected(Request $request) {

		// get parameters
		//
		$name = $request->input('name');

		// find current user
		//
		$user = User::find(Session::get('user_id'));
		if (!$user) {
			return response("User not found.", 404);
		}

		// find user's non-connections
		//
		return $user->findStrangersByName($name);
	}

	/**
	 * Get a user's connections.
	 *
	 * @param string $id - the id of the user to get connections of
	 * @return App\Models\Users\User[]
	 */
	public function getConnectionsByIndex(Request $request, string $userId) {

		// get parameters
		//
		$name = $request->input('name');

		// find user by id
		//
		$user = User::find($userId);
		if (!$user) {
			return response("User not found.", 404);
		}

		$users = $user->getConnections()->sortBy('last_name')->values();

		// apply filters
		//
		if ($name) {
			$users = $users->filter(function ($user) use ($name) {
				return strpos(strtolower($user->getFullName()), 
					strtolower($name)) !== false;
			})->values();
		}

		return $users;
	}

	/**
	 * Get a two user's mutual connections.
	 *
	 * @param string $userId - the id of the user to get mutual connections of
	 * @param string $connectionId - the id of the connection in common
	 * @return App\Models\Users\User[]
	 */
	public function getMutualConnectionsByIndex(string $userId, string $connectionId) {
		$mutualConnections = [];

		// find user by id
		//
		$user = User::find($userId);
		if (!$user) {
			return response("User not found.", 404);
		}

		// find connection by id
		//
		$connection = User::find($connectionId);
		if (!$connection) {
			return response("Connection not found.", 404);
		}

		$usersConnections = $user->getConnections()->sortBy('last_name')->values();
		$connectionsConnections = $connection->getConnections()->sortBy('last_name')->values();

		foreach ($usersConnections as $connection) {
			foreach ($connectionsConnections as $candidate) {
				if ($candidate->is($connection)) {
					array_push($mutualConnections, $connection);
					break;
				}
			}
		}

		return $mutualConnections;
	}

	/**
	 * Remove a user from a user's connections list.
	 *
	 * @param string $userId - the id of the user to isdisconnect connections of
	 * @param string $connectionId - the id of the connection to disconnect
	 * @return App\Models\Users\User[]
	 */
	public function deleteIndex(string $userId, string $connectionId) {
		
		// find user by id
		//
		$user = User::find($userId);
		if (!$user) {
			return response("User not found.", 404);
		}

		// find connection by id
		//
		$connection = User::find($connectionId);
		if (!$connection) {
			return response("Connection not found.", 404);
		}

		// get connection request
		//
		$connectionRequest = ConnectionRequest::where('user_id', '=', $userId)
			->where('connection_id', '=', $connectionId)->first();
		if (!$connectionRequest) {
			$connectionRequest = ConnectionRequest::where('user_id', '=', $connectionId)
				->where('connection_id', '=', $userId)->first();			
		}
		if (!$connectionRequest) {
			return response("Connection request not found.", 404);
		}

		// delete connection request
		//
		$connectionRequest->delete();

		return $user;
	}
}