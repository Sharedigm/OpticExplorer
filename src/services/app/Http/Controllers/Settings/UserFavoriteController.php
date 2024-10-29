<?php
/******************************************************************************\
|                                                                              |
|                           UserFavoriteController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a controller for manipulating a user's favorites.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Settings;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\BaseModel;
use App\Models\Settings\UserFavorite;
use App\Http\Controllers\Controller;

class UserFavoriteController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create current user's favorites by category.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $category - the category to create favorites of
	 * @return object
	 */
	public function postCreate(Request $request, string $category) {

		// get params
		//
		$input = $request->all();
		
		// get current user
		//
		$userId = Session::get('user_id');

		// delete previous user favorites
		//
		$this->deleteByCategory($category);

		// save new user favorites
		//
		$favorites = [];
		foreach ($input as $key => $value) {
			$type = gettype($value);

			// convert arrays to strings
			//
			if ($type == 'array') {
				$value = implode(',', $value);
			}

			// save new user favorite
			//
			$favorite = new UserFavorite([
				'user_id' => $userId,
				'category' => $category,
				'key' => $key,
				'value' => $value,
				'type' => $type
			]);
			$favorite->save();

			// save model attribute
			//
			array_push($favorites, $favorite);
		}

		// return model attributes
		//
		return $this->toObject($favorites);
	}

	//
	// conversion methods
	//

	/**
	 * Convert user favorites to object.
	 *
	 * @param App\Models\Settings\UserFavorite[] $favorites - the favorites to convert
	 * @return object
	 */
	public function toObject($favorites) {
		$model = new BaseModel();
		for ($i = 0; $i < sizeof($favorites); $i++) {
			$favorite = $favorites[$i];
			switch ($favorite->type) {
				case 'string':
					$model[$favorite->key] = $favorite->value;
					break;
				case 'boolean':
					$model[$favorite->key] = $favorite->value == '1' || $favorite->value == 'true';
					break;
				case 'integer':
					$model[$favorite->key] = intval($favorite->value);
					break;
				case 'float':
					$model[$favorite->key] = floatval($favorite->value);
					break;
				case 'double':
					$model[$favorite->key] = floatval($favorite->value);
					break;
			}
		}

		// return favorites as object
		//
		if (sizeof($favorites)) {
			return json_encode($model);
		} else {
			return json_encode($model, JSON_FORCE_OBJECT);
		}
	}

	//
	// querying methods
	//

	/**
	 * Get current user's favorites.
	 *
	 * @return object
	 */
	public function getCurrent() {
		return $this->getByUser(Session::get('user_id'));
	}

	/**
	 * Get current user's favorites by category.
	 *
	 * @param string $category - the category to get favorites of
	 * @return object
	 */
	public function getByCategory(string $category) {
		return $this->getByUserAndCategory(Session::get('user_id'), $category);
	}

	/**
	 * Get current user's favorites by category and key.
	 *
	 * @param string $category - the category to get favorites of
	 * @param string $key - the name of the favorite to get
	 * @return object
	 */
	public function getByKey(string $category, string $key) {
		return $this->getByUserAndKey(Session::get('user_id'), $category, $key);
	}

	/**
	 * Get a user's favorites.
	 *
	 * @param string $userId - the id of the user to get favorites belonging to
	 * @return object
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user favorites by user
		//
		$favorites = UserFavorite::where('user_id', '=', $userId)
			->get();

		// return model attributes
		//
		return $this->toObject($favorites);
	}

	/**
	 * Get a user's favorites by category.
	 *
	 * @param string $userId - the id of the user to get favorites belonging to
	 * @param string $category - the category to get favorites of
	 * @return object
	 */
	public function getByUserAndCategory(string $userId, string $category) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user favorites by user and category
		//
		$favorites = UserFavorite::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->get();

		// return model attributes
		//	
		return $this->toObject($favorites);
	}

	/**
	 * Get a user's favorites by category and key.
	 *
	 * @param string $userId - the id of the user to get favorites belonging to
	 * @param string $category - the category to get favorites of
	 * @param string $key - the key of the favorite to get
	 * @return object
	 */
	public function getByUserAndKey(string $userId, string $category, string $key) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user favorites by user, category, and key
		//
		$favorites = UserFavorite::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->where('key', '=', $key)
			->get();

		// return model attributes
		//	
		return $this->toObject($favorites);
	}

	//
	// updating methods
	//

	/**
	 * Update current user's favorites by category.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $category - the category to update favorites of
	 * @return object
	 */
	public function updateByCategory(Request $request, string $category) {

		// get params
		//
		$input = $request->all();
		
		// get current user
		//
		$userId = Session::get('user_id');

		// update user category favorites
		//
		$favorites = [];
		foreach ($input as $key => $value) {

			// delete previous user favorite
			//
			$this->deleteBy($category, $key);

			// save new user favorite
			//
			$favorite = new UserFavorite([
				'user_id' => $userId,
				'category' => $category,
				'key' => $key,
				'value' => $value,
				'type' => gettype($value)
			]);
			$favorite->save();

			// set model attribute
			//
			array_push($favorites, $favorite);
		}

		// return model attributes
		//	
		return $this->toObject($favorites);
	}

	//
	// deleting methods
	//

	/**
	 * Delete current user's favorites.
	 *
	 * @return object
	 */
	public function deleteCurrent() {

		// get current user
		//
		$userId = Session::get('user_id');

		// get user favorites by current user
		//
		$favorites = UserFavorite::where('user_id', '=', $userId)
			->get();
		UserFavorite::where('user_id', '=', $userId)
			->delete();

		// return model attributes
		//		
		return $this->toObject($favorites);
	}

	/**
	 * Delete current user's favorites by category.
	 *
	 * @param string $category - the category to delete favorites of
	 * @return object
	 */
	public function deleteByCategory(string $category) {

		// get current user
		//
		$userId = Session::get('user_id');

		// delete user favorites by current user and category
		//
		$favorites = UserFavorite::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->get();
		UserFavorite::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->delete();

		// return model attributes
		//		
		return $this->toObject($favorites);
	}

	/**
	 * Delete current user's favorites by category and key.
	 *
	 * @param string $category - the category to delete favorites of
	 * @param string $key - the name of the favorite to delete
	 * @return object
	 */
	public function deleteByKey(string $category, string $key) {

		// get current user
		//
		$userId = Session::get('user_id');
		
		// get user favorites by current user, category, and key
		//
		$favorites = UserFavorite::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->where('key', '=', $key)
			->get();
		UserFavorite::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->where('key', '=', $key)
			->delete();

		// return model attributes
		//			
		return $this->toObject($favorites);
	}
}
