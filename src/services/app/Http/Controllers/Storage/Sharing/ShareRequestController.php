<?php
/******************************************************************************\
|                                                                              |
|                          ShareRequestController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing share requests.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Storage\Sharing;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use App\Models\Users\Auth\UserSession;
use App\Models\Users\User;
use App\Models\Storage\Directory;
use App\Models\Storage\Sharing\Share;
use App\Models\Storage\Sharing\ShareRequest;
use App\Notifications\ShareRequestNotification;
use App\Http\Controllers\Controller;
use App\Utilities\Strings\StringUtils;
use App\Utilities\Uuids\Guid;

class ShareRequestController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new share request.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Sharing\ShareRequest
	 */
	public function postCreate(Request $request) {

		// create new share request
		//
		$shareRequest = new ShareRequest([
			'id' => Guid::create(),

			// user attributes
			//
			'user_id' => $request->input('user_id'),
			'connection_id' => $request->input('connection_id'),

			// target attributes
			//
			'message' => $request->input('message'),
			'path' => $request->input('path'),
			'copy' => $request->input('copy')
		]);

		// check validity of share request
		//
		if (!$shareRequest->user) {
			return response("User not found.", 404);
		}
		if (!$shareRequest->connection) {
			return response("Connection not found.", 404);
		}

		$shareRequest->save();

		// notify connection of share request
		//
		$shareRequest->connection->notify(new ShareRequestNotification([
			'share_request_id' => $shareRequest->id
		]));
		
		return $shareRequest;
	}

	//
	// querying methods
	//

	/**
	 * Get a share request.
	 *
	 * @param string $id - the id of the share request to get
	 * @return App\Models\Storage\Sharing\ShareRequest
	 */
	public function getIndex(string $id) {

		// find share request by id
		//
		$shareRequest = ShareRequest::find($id);
		if (!$shareRequest) {
			return response("Share request not found.", 404);
		}

		return $shareRequest;
	}

	/**
	 * Get share requests by path.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getByPath(Request $request) {
		if (UserSession::exists())  {
			$path = $request->input('path');
			return ShareRequest::sentBy(User::current())
				->where('path', '=', $path)
				->orderBy('created_at', 'ASC')
				->get();
		} else {
			return collect();
		}
	}

	//
	// sent share request querying methods
	//

	/**
	 * Get share requests sent by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSent() {
		return ShareRequest::sentBy(User::current())
			->get();
	}

	/**
	 * Get pending share requests sent by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getPendingSent() {
		return ShareRequest::sentBy(User::current())
			->pending()
			->get();
	}
	
	/**
	 * Get share requests sent by current user to a particular connection.
	 *
	 * @param string $connectionId
	 * @return Illuminate\Support\Collection
	 */
	public function getSentTo(string $connectionId) {
		return ShareRequest::sentBy(User::current())
			->where('connection_id', '=', $connectionId)
			->get();
	}

	/**
	 * Get pending share requests sent by current user to a particular connection.
	 *
	 * @param string $connectionId
	 * @return Illuminate\Support\Collection
	 */
	public function getPendingSentTo(string $connectionId) {
		return ShareRequest::sentBy(User::current())
			->where('connection_id', '=', $connectionId)
			->pending()
			->get();
	}

	//
	// received share request querying methods
	//

	/**
	 * Get share requests received by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getReceived() {
		return ShareRequest::receivedBy(User::current())
			->get();
	}

	/**
	 * Get pending share requests received by current user.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getPendingReceived() {
		return ShareRequest::receivedBy(User::current())
			->pending()
			->get();
	}

	/**
	 * Get share requests received by current user from a particular connection.
	 *
	 * @param string $connectionId
	 * @return Illuminate\Support\Collection
	 */
	public function getReceivedFrom(string $connectionId) {
		return ShareRequest::receivedBy(User::current())
			->where('user_id', '=', $connectionId)
			->get();
	}

	/**
	 * Get pending share requests received by current user from a particular connection.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getPendingReceivedFrom(string $connectionId) {
		return ShareRequest::receivedBy(User::current())
			->where('user_id', '=', $connectionId)
			->pending()
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Accept a share request.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the share request to accept
	 * @return App\Models\Storage\Sharing\ShareRequest
	 */
	public function acceptIndex(Request $request, string $id) {

		// get params
		//
		$destPath = $request->input('dest_path');

		// find share request by id
		//
		$shareRequest = ShareRequest::find($id);
		if (!$shareRequest) {
			return response("Share request not found.", 404);
		}

		// append trailing slash, if necessary
		//
		$isDirectory = StringUtils::endsWith($shareRequest->path, '/');
		if ($isDirectory) {
			if (!StringUtils::endsWith($destPath, '/')) {
				$destPath = $destPath . '/';
			}
		}

		// get share request attributes
		//
		$user = $shareRequest->user()->first();
		if (!$shareRequest) {
			return response("User not found.", 404);
		}
		$connection = $shareRequest->connection()->first();
		if (!$connection) {
			return response("Connection not found.", 404);
		}

		// copy or link file
		//
		if ($shareRequest->copy) {
			if (!$isDirectory) {

				// copy file
				//
				Storage::copy($user->account->username . '/' . $shareRequest->path, 
					$connection->account->username . '/' . $destPath);
			} else {

				// copy directory
				//
				Directory::copyDirectory($user->account->username . '/' . $shareRequest->path, 
					$connection->account->username . '/' . $destPath);
			}
		} else {

			// create new share
			//
			$share = new Share([
				'id' => Guid::create(),
				'user_id' => $shareRequest->connection_id,
				'owner_id' => $shareRequest->user_id,
				'path' => $destPath,
				'owner_path' => $shareRequest->path
			]);
			$share->save();

			// set share id of request
			//
			$shareRequest->share_id = $share->id;
		}

		$shareRequest->accept();
		return $shareRequest;	
	}

	/**
	 * Decline a share request.
	 *
	 * @param string $id - the id of the share request to decline
	 * @return App\Models\Storage\Sharing\ShareRequest
	 */
	public function declineIndex(string $id) {

		// find share request by id
		//
		$shareRequest = ShareRequest::find($id);
		if (!$shareRequest) {
			return response("Share request not found.", 404);
		}

		// decline share request
		//
		$shareRequest->decline();
		return $shareRequest;	
	}

	//
	// deleting methods
	//

	/**
	 * Delete a share request.
	 *
	 * @param string $id - the id of the share request to delete
	 * @return App\Models\Storage\Sharing\ShareRequest
	 */
	public function deleteIndex(string $id) {

		// find share request by id
		//
		$shareRequest = ShareRequest::find($id);
		if (!$shareRequest) {
			return response("Share request not found.", 404);
		}

		// delete shares associated with request
		//
		Share::where('owner_id', '=', $shareRequest->user_id)
			->where('owner_path', '=', $shareRequest->path)->delete();

		// delete request
		//
		$shareRequest->delete();
		return $shareRequest;
	}
}
