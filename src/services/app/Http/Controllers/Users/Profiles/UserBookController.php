<?php
/******************************************************************************\
|                                                                              |
|                             UserBookController.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' publication information.              |
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
use App\Models\Users\User;
use App\Models\Users\Profiles\UserBook;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserBookController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's book.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserBook
	 */
	public function postCreate(Request $request) {

		// create new user's book
		//
		$userBook = new UserBook([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),

			// who
			//
			'authors' => $request->input('authors'),

			// what
			//
			'title' => $request->input('title'),
			'subjects' => $request->input('subjects'),

			// when
			//
			'year' => $request->has('year')? intval($request->input('year')) : undefined,

			// where
			//
			'publisher' => $request->input('publisher'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),

			// why / how
			//
			'isbn_number' => $request->input('isbn_number'),
			'url' => $request->input('url')
		]);
		$userBook->save();
		
		return $userBook;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's book.
	 *
	 * @param string $id - the id of the user book to get
	 * @return App\Models\Users\Profiles\UserBook
	 */
	public function getIndex(string $id) {

		// find user's book by id
		//
		$userBook = UserBook::find($id);
		if (!$userBook) {
			return response("User's book not found.", 404);
		}

		return $userBook;
	}

	/**
	 * Get user's books.
	 *
	 * @param string $userId - the id of the user to get books belonging to
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
		return UserBook::belongingTo($userId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's book.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user book to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find a user's book by id
		//
		$userBook = UserBook::find($id);
		if (!$userBook) {
			return response("User's book not found.", 404);
		}

		// update user's book
		//
		return $userBook->change([

			// who
			//
			'authors' => $request->input('authors'),

			// what
			//
			'title' => $request->input('title'),
			'subjects' => $request->input('subjects'),

			// when
			//
			'year' => $request->has('year')? intval($request->input('year')) : undefined,

			// where
			//
			'publisher' => $request->input('publisher'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),

			// why / how
			//
			'isbn_number' => $request->input('isbn_number'),
			'url' => $request->input('url')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's book.
	 *
	 * @param string $id - the id of the user book to delete
	 * @return App\Models\Users\Profiles\UserBook
	 */
	public function deleteIndex(string $id) {

		// find a user's book by id
		//
		$userBook = UserBook::find($id);
		if (!$userBook) {
			return response("User's book not found.", 404);
		}

		// delete user's book
		//
		$userBook->delete();
		return $userBook;
	}
}
