<?php
/******************************************************************************\
|                                                                              |
|                                 places.php                                   |
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
use App\Http\Controllers\Places\PlaceController;
use App\Http\Controllers\Places\CheckInController;

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
	Route::post('places', [PlaceController::class, 'postCreate']);
	Route::get('places', [PlaceController::class, 'getAll']);
	Route::get('places/{id}', [PlaceController::class, 'getIndex']);
	Route::put('places/{id}', [PlaceController::class, 'updateIndex']);
	Route::delete('places/{id}', [PlaceController::class, 'deleteIndex']);
});

Route::group(['middleware' => 'verify.auth'], function() {
	Route::post('check-ins', [CheckInController::class, 'postCreate']);
	Route::get('check-ins', [CheckInController::class, 'getAll']);
	Route::get('check-ins/{id}', [CheckInController::class, 'getIndex']);
	Route::put('check-ins/{id}', [CheckInController::class, 'updateIndex']);
	Route::put('check-ins/{id}/check-out', [CheckInController::class, 'checkOutIndex']);
	Route::delete('check-ins/{id}', [CheckInController::class, 'deleteIndex']);
});