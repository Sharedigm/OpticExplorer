<?php
/******************************************************************************\
|                                                                              |
|                                utilities.php                                 |
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
use App\Http\Controllers\Utilities\CountryController;
use App\Http\Controllers\Utilities\WindStationController;
use App\Http\Controllers\Utilities\ShellController;

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
// public routes
//

// contact form routes
//
Route::get('countries', [CountryController::class, 'getAll']);

// mapping routes
//
Route::get('stations/wind', [WindStationController::class, 'getAll']);

//
// protected routes
//

Route::group(['middleware' => 'verify.storage_access'], function() {

	// shell access routes
	//
	Route::post('shell/exec', [ShellController::class, 'postCommand']);
});