<?php
/******************************************************************************\
|                                                                              |
|                               LinkController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for creating and managing links to files or      |
|        directories.                                                          |
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
use App\Models\Storage\Sharing\Link;
use App\Models\Storage\Sharing\Share;
use App\Models\Storage\File;
use App\Models\Storage\Directory;
use App\Models\Users\Accounts\UserAccount;
use App\Http\Controllers\Controller;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringUtils;

class LinkController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new link.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Sharing\Link
	 */
	public function postCreate(Request $request) {

		// create new link
		//
		$link = new Link([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'path' => $request->input('path'),
			'editable' => $request->input('editable'),
			'message' => $request->input('message'),
			'limit' => $request->input('limit'),
			'expiration_date' => $request->input('expiration_date'),
			'password' => $request->input('password')
		]);
		$link->save();
		
		return $link;
	}

	//
	// querying methods
	//

	/**
	 * Get a link.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the link to get
	 * @return App\Models\Storage\Sharing\Link
	 */
	public function getIndex(Request $request, string $id) {

		// find link by id
		//
		$link = Link::find($id);
		if (!$link) {
			return response("Link not found.", 404);
		}

		// check authentication
		//
		if ($link && $link->protected) {
			$link->authenticated = ($request->input('password') == $link->password);
		}

		return $link;
	}

	/**
	 * Get links by path.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$shareId = $request->input('share_id');

		// get link
		//
		if ($shareId) {
			$share = Share::find($shareId);
			if ($share->path == $path) {
				return Link::where('user_id', '=', $share->owner_id)
					->where('path', '=', $share->owner_path)
					->orderBy('created_at', 'DESC')
					->get();	
			} else {
				return Link::where('user_id', '=', $share->owner_id)
					->where('path', '=', $share->owner_path.basename($path))
					->orderBy('created_at', 'DESC')
					->get();	
			}
		} else {
			return Link::where('user_id', '=', Session::get('user_id'))
				->where('path', '=', $path)
				->orderBy('created_at', 'DESC')
				->get();	
		}
	}

	/**
	 * Get links by user.
	 *
	 * @param string $userId - the id of the user to get the links of
	 * @return Illuminate\Support\Collection
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// filter and sort by date
		//
		return Link::where('user_id', '=', $userId)
			->orderBy('created_at', 'DESC')
			->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a link.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the link to update
	 * @return App\Models\Storage\Sharing\Link
	 */
	public function updateIndex(Request $request, string $id) {

		// find link by id
		//
		$link = Link::find($id);
		if (!$link) {
			return response("Link not found.", 404);
		}

		// check authentication
		//
		if ($link && $link->protected) {
			$link->authenticated = ($request->input('password') == $link->password);
		}

		// update attributes
		//
		return $link->change([
			$link->editable = $request->input('editable'),
			$link->message = $request->input('message'),
			$link->limit = $request->input('limit'),
			$link->expiration_date = $request->input('expiration_date'),
			$link->password = $request->input('password')
		]);
	}

	//
	// downloading methods
	//

	/**
	 * Download a link's content.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the link to download the content of
	 * @return Illuminate\Support\Facades\Response
	 */
	public function downloadIndex(Request $request, string $id) {

		// find link
		//
		$link = Link::find($id);
		if (!$link) {
			return response("Link not found.", 404);
		}

		// check authentication
		//
		if ($link && $link->protected) {
			$link->authenticated = ($request->input('password') == $link->password);
		}

		// check file limit
		//
		if ($link->restricted) {
			return redirect(config('app.client_url') . '/#links/restricted');
		}

		// check expiration date
		//
		if ($link->expired) {
			return redirect(config('app.client_url') . '/#links/expired');
		}

		// check password
		//
		if ($link->protected) {
			if ($request->has('password')) {
				$password = $request->input('password');
				if ($password != $link->password) {
					return response("Invalid password", 403);
				}
			} else {
				return redirect(config('app.client_url') . '/#links/' . $id . '/password');
			}
		}

		$userAccount = UserAccount::where('user_id', '=', $link->user_id)->first();
		if ($userAccount) {
			if (!StringUtils::endsWith($link->path, '/')) {

				// download file link
				//
				$file = new File([
					'path' => $userAccount->username . '/' . $link->path
				]);

				// increment link count
				//
				$link->hits++;
				$link->save();

				return $file->download();
			} else {

				// increment link count
				//
				$link->hits++;
				$link->save();

				$path = $request->input('path');
				if ($path && !StringUtils::endsWith($path, '/')) {

					// create reference to linked file
					//
					$file = new File([
						'path' => $userAccount->username . '/' . $link->path . $path
					]);

					// download file referenced from link
					//
					return $file->download();
				} else {

					// create refererence to linked directory
					//
					$directory = new Directory([
						'path' => $userAccount->username . '/' . $link->path
					]);

					// compress to file in user's temporary folder
					//
					$dest = FileStorage::temp() . '/' . basename($link->path) . '.zip';

					// compress directory to destination and download
					//
					$directory->compressTo($dest);

					// return compressed file
					//
					return response()->download($dest);
				}
			}
		} else {
			return response("Invalid download link - link owner not found.", 404);	
		}
	}

	//
	// deleting methods
	//

	/**
	 * Delete a link.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the link to delete
	 * @return App\Models\Storage\Sharing\Link
	 */
	public function deleteIndex(Request $request, string $id) {

		// find link by id
		//
		$link = Link::find($id);
		if (!$link) {
			return response("Link not found.", 404);
		}

		// check authentication
		//
		if ($link && $link->protected) {
			$link->authenticated = ($request->input('password') == $link->password);
		}

		// delete link
		//
		$link->delete();
		return $link;
	}

	//
	// static methods
	//

	/**
	 * Get current request's link.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Sharing\Link
	 */
	public static function current(Request $request) {
		if ($request->has('link_id')) {
			return Link::find($request->input('link_id'));
		} else {
			return null;
		}
	}
}
