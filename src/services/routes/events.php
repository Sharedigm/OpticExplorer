<?php
/******************************************************************************\
|                                                                              |
|                                  events.php                                  |
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
use App\Http\Controllers\Users\Events\UserEventController;

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

Route::group(['middleware' => 'verify.auth'], function() {
	
	// event routes
	//
	Route::group(['middleware' => 'verify.user_event'], function () {
		Route::post('events', [UserEventController::class, 'postCreate']);
		Route::get('events', [UserEventController::class, 'getAll']);
		Route::get('events/{id}', [UserEventController::class, 'getIndex']);
		Route::put('events/{id}', [UserEventController::class, 'updateIndex']);
		Route::delete('events/{id}', [UserEventController::class, 'deleteIndex']);
	});
});