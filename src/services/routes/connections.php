<?php
/******************************************************************************\
|                                                                              |
|                               connections.php                                |
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
use App\Http\Controllers\Users\Connections\ConnectionController;
use App\Http\Controllers\Users\Connections\GroupController;
use App\Http\Controllers\Users\Connections\GroupMemberController;
use App\Http\Controllers\Users\Connections\ConnectionRequestController;

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

Route::get('users/{id}/connections', [ConnectionController::class, 'getConnectionsByIndex']);
Route::get('users/{id}/connections/{connection_id}', [ConnectionController::class, 'getMutualConnectionsByIndex']);

//
// protected routes
//

Route::group(['middleware' => 'verify.auth'], function() {

	// group routes
	//
	Route::post('groups', [GroupController::class, 'postCreate']);
	Route::get('groups/{id}', [GroupController::class, 'getIndex']);
	Route::get('users/{id}/groups', [GroupController::class, 'getByUser']);
	Route::put('groups/{id}', [GroupController::class, 'updateIndex']);
	Route::delete('groups/{id}', [GroupController::class, 'deleteIndex']);

	// group member routes
	//
	Route::post('groups/{id}/members/{user_id}', [GroupMemberController::class, 'postCreate']);
	Route::delete('groups/{id}/members/{user_id}', [GroupMemberController::class, 'deleteIndex']);

	// user connection routes
	//
	Route::get('connections/connected', [ConnectionController::class, 'getConnected']);
	Route::get('connections/unconnected', [ConnectionController::class, 'getUnconnected']);
	Route::delete('users/{id}/connections/{connection_id}', [ConnectionController::class, 'deleteIndex']);

	// connection request routes
	//
	Route::post('connection-requests', [ConnectionRequestController::class, 'postCreate']);
	Route::get('connection-requests/{id}', [ConnectionRequestController::class, 'getIndex']);
	Route::put('connection-requests/{id}/accept', [ConnectionRequestController::class, 'acceptIndex']);
	Route::put('connection-requests/{id}/decline', [ConnectionRequestController::class, 'declineIndex']);
	Route::delete('connection-requests/{id}', [ConnectionRequestController::class, 'deleteIndex']);

	// user connection request routes
	//
	Route::get('users/{id}/connection-requests/received/pending', [ConnectionRequestController::class, 'getPendingReceivedByUser']);
	Route::get('users/{id}/connection-requests/received', [ConnectionRequestController::class, 'getReceivedByUser']);
	Route::get('users/{id}/connection-requests/sent/pending', [ConnectionRequestController::class, 'getPendingSentByUser']);
	Route::get('users/{id}/connection-requests/sent', [ConnectionRequestController::class, 'getSentByUser']);
});