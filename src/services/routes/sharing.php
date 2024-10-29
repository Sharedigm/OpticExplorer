<?php
/******************************************************************************\
|                                                                              |
|                                 sharing.php                                  |
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
use App\Http\Controllers\Storage\Sharing\LinkController;
use App\Http\Controllers\Storage\Sharing\ShareRequestController;
use App\Http\Controllers\Storage\Sharing\ShareController;

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

// public link routes
//
Route::get('links', [LinkController::class, 'getByPath']);
Route::get('links/{id}', [LinkController::class, 'getIndex']);
Route::get('links/{id}/download', [LinkController::class, 'downloadIndex']);

//
// protected routes
//

Route::group(['middleware' => 'verify.auth'], function() {

	// share request routes
	//
	Route::post('share-requests', [ShareRequestController::class, 'postCreate']);
	Route::get('share-requests', [ShareRequestController::class, 'getByPath']);
	Route::get('share-requests/{id}', [ShareRequestController::class, 'getIndex']);

	// sent share request routes
	//
	Route::get('share-requests/sent', [ShareRequestController::class, 'getSent']);
	Route::get('share-requests/sent/pending', [ShareRequestController::class, 'getPendingSent']);
	Route::get('share-requests/sent/users/{id}', [ShareRequestController::class, 'getSentTo']);
	Route::get('share-requests/sent/pending/users/{id}', [ShareRequestController::class, 'getPendingSentTo']);

	// received share request routes
	//
	Route::get('share-requests/received', [ShareRequestController::class, 'getReceived']);
	Route::get('share-requests/received/pending', [ShareRequestController::class, 'getPendingReceived']);
	Route::get('users/{id}/share-requests/received', [ShareRequestController::class, 'getReceivedFrom']);
	Route::get('users/{id}/share-requests/received/pending', [ShareRequestController::class, 'getPendingReceivedFrom']);

	// accept / decline / delete
	//
	Route::put('share-requests/{id}/accept', [ShareRequestController::class, 'acceptIndex']);
	Route::put('share-requests/{id}/decline', [ShareRequestController::class, 'declineIndex']);
	Route::delete('share-requests/{id}', [ShareRequestController::class, 'deleteIndex']);

	// sharing routes
	//
	Route::get('users/{id}/shares/received', [ShareController::class, 'getByUser']);
	Route::get('users/{id}/shares/sent', [ShareController::class, 'getByOwner']);
	Route::delete('shares/{id}', [ShareController::class, 'deleteIndex']);

	// linking routes
	//
	Route::post('links', [LinkController::class, 'postCreate']);
	Route::get('users/{id}/links', [LinkController::class, 'getByUser']);
	Route::put('links/{id}', [LinkController::class, 'updateIndex']);
	Route::delete('links/{id}', [LinkController::class, 'deleteIndex']);
});