<?php
/******************************************************************************\
|                                                                              |
|                                 settings.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the REST API routes used by the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

use Illuminate\Http\Request;
use App\Http\Controllers\Settings\UserSettingController;
use App\Http\Controllers\Settings\UserPreferenceController;
use App\Http\Controllers\Settings\UserFavoriteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//
// protected routes
//

Route::group(['middleware' => 'verify.settings'], function() {

	// user settings routes
	//
	Route::post('settings/{category}', [UserSettingController::class, 'postCreate']);

	Route::get('settings', [UserSettingController::class, 'getCurrent']);
	Route::get('settings/{category}', [UserSettingController::class, 'getByCategory']);
	Route::get('settings/{category}/{key}', [UserSettingController::class, 'getByKey']);

	Route::get('users/{id}/settings', [UserSettingController::class, 'getByUser']);
	Route::get('users/{id}/settings/{category}', [UserSettingController::class, 'getByUserAndCategory']);
	Route::get('users/{id}/settings/{category}/{key}', [UserSettingController::class, 'getByUserAndKey']);

	Route::put('settings/{category}', [UserSettingController::class, 'updateByCategory']);
	Route::put('settings/{category}/{key}', [UserSettingController::class, 'updateByKey']);

	Route::delete('settings', [UserSettingController::class, 'deleteCurrent']);
	Route::delete('settings/{category}', [UserSettingController::class, 'deleteByCategory']);
	Route::delete('settings/{category}/{key}', [UserSettingController::class, 'deleteByKey']);

	// user preferences routes
	//
	Route::post('preferences/{app}', [UserPreferenceController::class, 'postCreate']);

	Route::get('preferences', [UserPreferenceController::class, 'getCurrent']);
	Route::get('preferences/{app}', [UserPreferenceController::class, 'getByApp']);
	Route::get('preferences/{app}/{key}', [UserPreferenceController::class, 'getByKey']);

	Route::get('users/{id}/preferences', [UserPreferenceController::class, 'getByUser']);
	Route::get('users/{id}/preferences/{app}', [UserPreferenceController::class, 'getByUserAndApp']);
	Route::get('users/{id}/preferences/{app}/{key}', [UserPreferenceController::class, 'getByUserAndKey']);

	Route::put('preferences/{app}', [UserPreferenceController::class, 'updateByApp']);
	Route::put('preferences/{app}/{key}', [UserPreferenceController::class, 'updateByKey']);

	Route::delete('preferences', [UserPreferenceController::class, 'deleteCurrent']);
	Route::delete('preferences/{app}', [UserPreferenceController::class, 'deleteByApp']);
	Route::delete('preferences/{app}/{key}', [UserPreferenceController::class, 'deleteByKey']);

	// user favorites routes
	//
	Route::post('favorites/{category}', [UserFavoriteController::class, 'postCreate']);

	Route::get('favorites', [UserFavoriteController::class, 'getCurrent']);
	Route::get('favorites/{category}', [UserFavoriteController::class, 'getByCategory']);
	Route::get('favorites/{category}/{key}', [UserFavoriteController::class, 'getByKey']);

	Route::get('users/{id}/favorites', [UserFavoriteController::class, 'getByUser']);
	Route::get('users/{id}/favorites/{category}', [UserFavoriteController::class, 'getByUserAndCategory']);
	Route::get('users/{id}/favorites/{category}/{key}', [UserFavoriteController::class, 'getByUserAndKey']);

	Route::put('favorites/{category}', [UserFavoriteController::class, 'updateByCategory']);
	Route::put('favorites/{category}/{key}', [UserFavoriteController::class, 'updateByKey']);

	Route::delete('favorites', [UserFavoriteController::class, 'deleteCurrent']);
	Route::delete('favorites/{category}', [UserFavoriteController::class, 'deleteByCategory']);
	Route::delete('favorites/{category}/{key}', [UserFavoriteController::class, 'deleteByKey']);
});