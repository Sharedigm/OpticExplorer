<?php
/******************************************************************************\
|                                                                              |
|                                 projects.php                                 |
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
use App\Http\Controllers\Projects\ProjectController;
use App\Http\Controllers\Projects\Sharing\ProjectInvitationController;
use App\Http\Controllers\Projects\TaskController;

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

	// current user routes
	//
	Route::get('users/current/projects', [ProjectController::class, 'getOwnedOrSubscribed']);
	Route::get('users/current/projects/owned', [ProjectController::class, 'getOwned']);
	Route::get('users/current/projects/subscribed', [ProjectController::class, 'getSubscribed']);
	Route::get('users/current/projects/unsubscribed', [ProjectController::class, 'getUnsubscribed']);
	Route::get('users/current/projects/unsubscribed/public', [ProjectController::class, 'getPublicUnsubscribed']);

	// project routes
	//
	Route::group(['middleware' => 'verify.project'], function () {
		Route::post('projects', [ProjectController::class, 'postCreate']);
		Route::get('projects/public', [ProjectController::class, 'getPublic']);
		Route::get('projects/{id}/users', [ProjectController::class, 'getUsers']);
		Route::get('projects/{id}/thumb', [ProjectController::class, 'getThumbnail']);
		Route::put('projects/{id}/users/{user_id}/add', [ProjectController::class, 'addUser']);
		Route::put('projects/{id}/users/{user_id}/remove', [ProjectController::class, 'removeUser']);
		Route::put('projects/{id}/users/{ids}/invite', [ProjectController::class, 'inviteUsers']);
		Route::put('projects/{id}', [ProjectController::class, 'updateIndex']);
		Route::delete('projects/{id}', [ProjectController::class, 'deleteIndex']);
	});

	// project invitation routes
	//
	Route::group(['middleware' => 'verify.project_invitation'], function () {
		Route::put('projects/invitations/{id}/accept', [ProjectInvitationController::class, 'acceptIndex']);
		Route::put('projects/invitations/{id}/decline', [ProjectInvitationController::class, 'declineIndex']);
	});
	
	// task routes
	//
	Route::group(['middleware' => 'verify.task'], function () {
		Route::post('tasks', [TaskController::class, 'postCreate']);
		Route::get('users/current/tasks', [TaskController::class, 'getCurrent']);
		Route::get('projects/{id}/tasks', [TaskController::class, 'getByProject']);
		Route::put('tasks/{id}', [TaskController::class, 'updateIndex']);
		Route::put('tasks/{id}/like', [TaskController::class, 'putLike']);
		Route::delete('tasks/{id}', [TaskController::class, 'deleteIndex']);
	});
});