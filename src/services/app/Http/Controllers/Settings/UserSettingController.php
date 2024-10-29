<?php
/******************************************************************************\
|                                                                              |
|                           UserSettingController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a controller for manipulating a user's settings.         |
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
use App\Models\Settings\UserSetting;
use App\Http\Controllers\Controller;

class UserSettingController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create current user's settings by category.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $category - the category to create settings of
	 * @return object
	 */
	public function postCreate(Request $request, string $category) {

		// get params
		//
		$input = $request->all();

		// get current user
		//
		$userId = Session::get('user_id');
		
		// delete previous user settings
		//
		$this->deleteByCategory($category);

		// save new user settings
		//
		$settings = [];
		foreach ($input as $key => $value) {
			$type = gettype($value);

			// convert arrays to strings
			//
			if ($type == 'array') {
				$value = implode(',', $value);
			}

			// save new user setting
			//
			$setting = new UserSetting([
				'user_id' => $userId,
				'category' => $category,
				'key' => $key,
				'value' => $value,
				'type' => $type
			]);
			$setting->save();

			// save model attribute
			//
			array_push($settings, $setting);
		}

		// return model attributes
		//
		return $this->toObject($settings);
	}

	//
	// conversion methods
	//

	/**
	 * Convert user settings to object.
	 *
	 * @param App\Models\Settings\UserSetting[] $settings - the settings to convert
	 * @return object
	 */
	public function toObject($settings) {
		$model = new BaseModel();
		for ($i = 0; $i < sizeof($settings); $i++) {
			$setting = $settings[$i];
			if ($setting->key) {
				switch ($setting->type) {
					case 'boolean':
						$model[$setting->key] = boolval($setting->value);
						break;
					case 'integer':
						$model[$setting->key] = intval($setting->value);
						break;
					case 'float':
						$model[$setting->key] = floatval($setting->value);
						break;
					case 'double':
						$model[$setting->key] = floatval($setting->value);
						break;
					case 'array':
						$model[$setting->key] = explode(',', $setting->value);
						break;
					default:
						$model[$setting->key] = $setting->value;
				}
			}
		}

		// return favorites as object
		//
		if (sizeof($settings)) {
			return json_encode($model);
		} else {
			return json_encode($model, JSON_FORCE_OBJECT);
		}
	}

	//
	// querying methods
	//

	/**
	 * Get current user's settings.
	 *
	 * @return object
	 */
	public function getCurrent() {
		return $this->getByUser(Session::get('user_id'));
	}

	/**
	 * Get current user's settings by category.
	 *
	 * @param string $category - the category to get settings of
	 * @return object
	 */
	public function getByCategory(string $category) {
		return $this->getByUserAndCategory(Session::get('user_id'), $category);
	}

	/**
	 * Get current user's settings by category and key.
	 *
	 * @param string $category - the categor to get settings of
	 * @param string $key - the name of the settings to get
	 * @return object
	 */
	public function getByKey(string $category, string $key) {
		return $this->getByUserAndKey(Session::get('user_id'), $category, $key);
	}

	/**
	 * Get a user's settings.
	 *
	 * @param string $userId - the id of the user to get settings belonging to
	 * @return object
	 */
	public function getByUser(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user settings by user
		//
		$settings = UserSetting::where('user_id', '=', $userId)
			->get();

		// return model attributes
		//	
		return $this->toObject($settings);
	}

	/**
	 * Get a user's settings by category.
	 *
	 * @param string $userId - the id of the user to get settings belonging to
	 * @param string $category - the category of the settings to get
	 * @return object
	 */
	public function getByUserAndCategory(string $userId, string $category) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user settings by user and category
		//
		$settings = UserSetting::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->get();

		// return model attributes
		//
		return $this->toObject($settings);
	}

	/**
	 * Get a user's settings by category and key.
	 *
	 * @param string $userId - the id of the user to get settings belonging to
	 * @param string $category - the category of the settings to get
	 * @param string $key - the name of the settings to get
	 * @return object
	 */
	public function getByUserAndKey(string $userId, string $category, string $key) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// get user settings by user, category, and key
		//
		$settings = UserSetting::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->where('key', '=', $key)
			->get();

		// return model attributes
		//
		return $this->toObject($settings);
	}

	//
	// updating methods
	//

	/**
	 * Update current user settings.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $category - the category of the settings to update
	 * @return object
	 */
	public function updateByCategory(Request $request, string $category) {

		// get params
		//
		$input = $request->all();

		// get current user
		//
		$userId = Session::get('user_id');

		// store user app settings
		//
		$settings = [];
		foreach ($input as $key => $value) {

			// delete previous user setting
			//
			$this->deleteByKey($category, $key);

			// save new user setting
			//
			$setting = new UserSetting([
				'user_id' => $userId,
				'category' => $category,
				'key' => $key,
				'value' => $value,
				'type' => gettype($value)
			]);
			$setting->save();

			// set model attribute
			//
			array_push($settings, $setting);
		}

		// return model attributes
		//
		return $this->toObject($settings);
	}

	/**
	 * Update current user's setting by category and key.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $category - the category of the settings to update
	 * @param string $key - the name of the settings to update
	 * @return object
	 */
	public function updateByKey(Request $request, string $category, string $key) {

		// get params
		//
		$value = $request->input('value');

		// get current user
		//
		$userId = Session::get('user_id');

		// delete previous user setting
		//
		$this->deleteByKey($category, $key);

		// save new user setting
		//
		$setting = new UserSetting([
			'user_id' => $userId,
			'category' => $category,
			'key' => $key,
			'value' => $value,
			'type' => gettype($value)
		]);
		$setting->save();

		// return model attributes
		//
		return $this->toObject([$setting]);
	}

	//
	// deleting methods
	//

	/**
	 * Delete current user's settings.
	 *
	 * @return object
	 */
	public function deleteCurrent() {

		// get current user
		//
		$userId = Session::get('user_id');

		// delete user settings by current user
		//
		$settings = UserSetting::where('user_id', '=', $userId)
			->get();
		UserSetting::where('user_id', '=', $userId)
			->delete();

		// return model attributes
		//
		return $this->toObject($settings);
	}

	/**
	 * Delete current user's settings by category.
	 *
	 * @param string $category - the category of the settings to delete
	 * @return object
	 */
	public function deleteByCategory(string $category) {

		// get current user
		//
		$userId = Session::get('user_id');

		// delete user settings by current user and category
		//
		$settings = UserSetting::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->get();
		UserSetting::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->delete();

		// return model attributes
		//
		return $this->toObject($settings);
	}

	/**
	 * Delete current user's settings by category and key.
	 *
	 * @param string $category - the category of the settings to delete
	 * @param string $key - the name of the settings to delete
	 * @return object
	 */
	public function deleteByKey(string $category, string $key) {

		// get current user
		//
		$userId = Session::get('user_id');

		// delete user settings by current user, category, and key
		//
		$settings = UserSetting::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->where('key', '=', $key)->get();
		UserSetting::where('user_id', '=', $userId)
			->where('category', '=', $category)
			->where('key', '=', $key)->delete();

		// return model attributes
		//
		return $this->toObject($settings);
	}
}
