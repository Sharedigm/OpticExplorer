<?php
/******************************************************************************\
|                                                                              |
|                         UserPreferenceController.php                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a controller for manipulating a user's preferences.      |
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
use App\Models\Settings\UserPreference;
use App\Http\Controllers\Controller;

class UserPreferenceController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create current user's preferences by app.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $app - the app to create preferences for
	 * @return object
	 */
	public function postCreate(Request $request, string $app) {

		// get params
		//
		$input = $request->all();

		// get current user
		//
		$userId = Session::get('user_id');

		// delete previous user preferences
		//
		$this->deleteByApp($app);

		// save new user preferences
		//
		$preferences = [];
		foreach ($input as $key => $value) {
			$type = gettype($value);

			// covert arrays to strings
			//
			if ($type == 'array') {
				$value = implode(',', $value);
			}

			// save new user preference
			//
			$preference = new UserPreference([
				'user_id' => $userId,
				'app' => $app,
				'key' => $key,
				'value' => $value,
				'type' => $type
			]);

			$preference->save();

			// save model attribute
			//
			array_push($preferences, $preference);
		}

		// return model attributes
		//
		return $this->toObject($preferences);
	}

	//
	// conversion methods
	//

	/**
	 * Convert user preferences to object.
	 *
	 * @param App\Models\Settings\UserPreference[] $preferences - the preferences to convert
	 * @return object
	 */
	public function toObject($preferences) {
		$model = new BaseModel();
		for ($i = 0; $i < sizeof($preferences); $i++) {
			$preference = $preferences[$i];
			if ($preference->key) {
				switch ($preference->type) {
					case 'string':
						$model[$preference->key] = $preference->value;
						break;
					case 'boolean':
						$model[$preference->key] = $preference->value == '1' || $preference->value == 'true';
						break;
					case 'integer':
						$model[$preference->key] = intval($preference->value);
						break;
					case 'float':
						$model[$preference->key] = floatval($preference->value);
						break;
					case 'double':
						$model[$preference->key] = floatval($preference->value);
						break;
					case 'array':
						$model[$preference->key] = explode(',', $preference->value);
						break;
				}
			}
		}

		// return favorites as object
		//
		if (sizeof($preferences)) {
			return $model;
		} else {
			return json_encode($model, JSON_FORCE_OBJECT);
		}
	}

	//
	// querying methods
	//

	/**
	 * Get current user's preferences.
	 *
	 * @return object
	 */
	public function getCurrent() {
		return $this->getByUser(Session::get('user_id'));
	}

	/**
	 * Get current user's preferences by app.
	 *
	 * @param string $app - the app to get preferences of
	 * @return object
	 */
	public function getByApp(string $app) {
		return $this->getByUserAndApp(Session::get('user_id'), $app);
	}

	/**
	 * Get current user's preferences by app and key.
	 *
	 * @param string $app - the app to get preferences of
	 * @param string $key - the name of the preferences to get
	 * @return object
	 */
	public function getByKey(string $app, string $key) {
		return $this->getByUserAndKey(Session::get('user_id'), $app, $key);
	}

	/**
	 * Get a user's preferences.
	 *
	 * @param string $userId - the id of the user to get preferences belonging to
	 * @return object
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user preferences by user
		//
		$preferences = UserPreference::where('user_id', '=', $userId)
			->get();

		// return model attributes
		//
		return $this->toObject($preferences);
	}

	/**
	 * Get a user's preferences by app.
	 *
	 * @param string $userId - the id of the user to get preferences belonging to
	 * @param string $app - the app to get preferences of
	 * @return object
	 */
	public function getByUserAndApp(string $userId, string $app) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user preferences by user and app
		//
		$preferences = UserPreference::where('user_id', '=', $userId)
			->where('app', '=', $app)
			->get();

		// return model attributes
		//	
		return $this->toObject($preferences);
	}

	/**
	 * Get a user's preferences by app and key.
	 *
	 * @param string $userId - the id of the user to get preferences belonging to
	 * @param string $app - the app to get preferences of
	 * @param string $key - the name of the preferences to get
	 * @return object
	 */
	public function getByUserAndKey(string $userId, string $app, string $key) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user preferences by user, app, and key
		//
		$preferences = UserPreference::where('user_id', '=', $userId)
			->where('app', '=', $app)
			->where('key', '=', $key)
			->get();

		// return model attributes
		//		
		return $this->toObject($preferences);
	}

	//
	// updating methods
	//

	/**
	 * Update current user's preferences by app
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $app - the app to update preferences of
	 * @return object
	 */
	public function updateByApp(Request $request, string $app) {

		// get params
		//
		$input = $request->all();
		
		// get current user
		//
		$userId = Session::get('user_id');

		// store user app preferences
		//
		$preferences = [];
		foreach ($input as $key => $value) {

			// delete previous user preference
			//
			$this->deleteByKey($app, $key);

			// save new user preference
			//
			$preference = new UserPreference([
				'user_id' => $userId,
				'app' => $app,
				'key' => $key,
				'value' => $value,
				'type' => gettype($value)
			]);
			$preference->save();

			// set model attribute
			//
			array_push($preferences, $preference);
		}

		// return model attributes
		//	
		return $this->toObject($preferences);
	}

	/**
	 * Update current user's preferences by app and key
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $app - the app to update preferences of
	 * @param string $key - the name of the preferences to update
	 * @return object
	 */
	public function updateByKey(Request $request, string $app, string $key) {

		// get params
		//
		$value = $request->input('value');
		
		// get current user
		//
		$userId = Session::get('user_id');

		// delete previous user preference
		//
		$this->deleteByKey($app, $key);

		// save new user preference
		//
		$preference = new UserPreference([
			'user_id' => $userId,
			'app' => $app,
			'key' => $key,
			'value' => $value,
			'type' => gettype($value)
		]);
		$preference->save();

		// return model attributes
		//	
		return $this->toObject([$preference]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete current user's preferences.
	 *
	 * @return object
	 */
	public function deleteCurrent() {

		// get current user
		//
		$userId = Session::get('user_id');

		// delete user preferences by current user
		//
		$preferences = UserPreference::where('user_id', '=', $userId)
			->get();
		UserPreference::where('user_id', '=', $userId)
			->delete();

		// return model attributes
		//			
		return $this->toObject($preferences);
	}

	/**
	 * Delete current user's preferences by app.
	 *
	 * @param string $app - the app to delete preferences of
	 * @return object
	 */
	public function deleteByApp(string $app) {

		// get current user
		//
		$userId = Session::get('user_id');

		// delete user preferences by current user and app
		//
		$preferences = UserPreference::where('user_id', '=', $userId)
			->where('app', '=', $app)
			->get();
		UserPreference::where('user_id', '=', $userId)
			->where('app', '=', $app)
			->delete();

		// return model attributes
		//	
		return $this->toObject($preferences);
	}

	/**
	 * Delete current user's preferences by app and key.
	 *
	 * @param string $app - the app to delete preferences of
	 * @param string $key - the name of the preferences to delete
	 * @return object
	 */
	public function deleteByKey(string $app, string $key) {

		// get current user
		//
		$userId = Session::get('user_id');
		
		// delete user preferences by current user, app, and key
		//
		$preferences = UserPreference::where('user_id', '=', $userId)
			->where('app', '=', $app)
			->where('key', '=', $key)
			->get();
		UserPreference::where('user_id', '=', $userId)
			->where('app', '=', $app)
			->where('key', '=', $key)
			->delete();

		// return model attributes
		//	
		return $this->toObject($preferences);
	}
}
