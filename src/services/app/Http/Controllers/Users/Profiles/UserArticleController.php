<?php
/******************************************************************************\
|                                                                              |
|                           UserArticleController.php                          |
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
use App\Models\Users\Profiles\UserArticle;
use App\Http\Controllers\Controller;
use App\Utilities\Uuids\Guid;

class UserArticleController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new user's article.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Profiles\UserArticle
	 */
	public function postCreate(Request $request) {

		// create new user's article
		//
		$userArticle = new UserArticle([
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
			'date' => $request->input('date'),

			// where
			//
			'journal' => $request->input('journal'),
			'publisher' => $request->input('publisher'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),

			// why / how
			//
			'issn_number' => $request->input('issn_number'),
			'url' => $request->input('url')
		]);
		$userArticle->save();
		
		return $userArticle;
	}

	//
	// querying methods
	//

	/**
	 * Get a user's article.
	 *
	 * @param string $id - the id of the user article to get
	 * @return App\Models\Users\Profiles\UserArticle
	 */
	public function getIndex(string $id) {

		// find user's article by id
		//
		$userArticle = UserArticle::find($id);
		if (!$userArticle) {
			return response("User's article not found.", 404);
		}

		return $userArticle;
	}

	/**
	 * Get user's articles.
	 *
	 * @param string $userId - the id of the user to get articles belonging to
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
		return UserArticle::belongingTo($userId)->get();
	}

	//
	// updating methods
	//

	/**
	 * Update a user's article.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the user article to update
	 * @return object
	 */
	public function updateIndex(Request $request, string $id) {

		// find user's article by id
		//
		$userArticle = UserArticle::find($id);
		if (!$userArticle) {
			return response("User's article not found.", 404);
		}

		// update user's article
		//
		return $userArticle->change([

			// who
			//
			'authors' => $request->input('authors'),

			// what
			//
			'title' => $request->input('title'),
			'subjects' => $request->input('subjects'),

			// when
			//
			'date' => $request->input('date'),

			// where
			//
			'journal' => $request->input('journal'),
			'publisher' => $request->input('publisher'),
			'city' => $request->input('city'),
			'state' => $request->input('state'),
			'country' => $request->input('country'),

			// why / how
			//
			'issn_number' => $request->input('issn_number'),
			'url' => $request->input('url')
		]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete a user's article.
	 *
	 * @param string $id - the id of the user article to delete
	 * @return App\Models\Users\Profiles\UserArticle
	 */
	public function deleteIndex(string $id) {

		// find user's article by id
		//
		$userArticle = UserArticle::find($id);
		if (!$userArticle) {
			return response("User's article not found.", 404);
		}

		// delete user's article
		//
		$userArticle->delete();
		return $userArticle;
	}
}
