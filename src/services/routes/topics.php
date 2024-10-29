<?php
/******************************************************************************\
|                                                                              |
|                                  topics.php                                  |
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
use App\Http\Controllers\Topics\TopicController;
use App\Http\Controllers\Topics\Sharing\TopicInvitationController;
use App\Http\Controllers\Topics\PostController;
use App\Http\Controllers\Topics\PostAttachmentController;

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

	// current user topic routes
	//
	Route::get('topics', [TopicController::class, 'getOwnedOrSubscribed']);
	Route::get('topics/all', [TopicController::class, 'getAll']);
	Route::get('topics/public', [TopicController::class, 'getPublic']);
	Route::get('topics/owned', [TopicController::class, 'getOwned']);
	Route::get('topics/subscribed', [TopicController::class, 'getSubscribed']);
	Route::get('topics/unsubscribed', [TopicController::class, 'getUnsubscribed']);
	Route::get('topics/unsubscribed/public', [TopicController::class, 'getPublicUnsubscribed']);

	// topic routes
	//
	Route::group(['middleware' => 'verify.topic'], function () {
		Route::post('topics', [TopicController::class, 'postCreate']);
		Route::get('topics/{id}/users', [TopicController::class, 'getUsers']);
		Route::put('topics/{id}/users/{user_id}/add', [TopicController::class, 'addUser']);
		Route::put('topics/{id}/users/{user_id}/remove', [TopicController::class, 'removeUser']);
		Route::put('topics/{id}/users/{ids}/invite', [TopicController::class, 'inviteUsers']);
		Route::put('topics/{id}', [TopicController::class, 'updateIndex']);
		Route::delete('topics/{id}', [TopicController::class, 'deleteIndex']);
	});

	// topic invitation routes
	//
	Route::group(['middleware' => 'verify.topic_invitation'], function () {
		Route::put('topics/invitations/{id}/accept', [TopicInvitationController::class, 'acceptIndex']);
		Route::put('topics/invitations/{id}/decline', [TopicInvitationController::class, 'declineIndex']);
	});
	
	// post routes
	//
	Route::group(['middleware' => 'verify.post'], function () {
		Route::post('posts', [PostController::class, 'postCreate']);
		Route::get('users/current/posts', [PostController::class, 'getPosts']);
		Route::get('users/current/posts/updates', [PostController::class, 'getUpdates']);
		Route::get('users/{id}/posts/updates', [PostController::class, 'getUpdatesByUser']);
		Route::get('topics/{id}/posts', [PostController::class, 'getByTopic']);
		Route::get('topics/{id}/posts/updates', [PostController::class, 'getUpdatesByTopic']);
		Route::put('users/current/posts/update', [PostController::class, 'updateCurrent']);	
		Route::put('posts/{id}', [PostController::class, 'updateIndex']);
		Route::put('posts/{id}/like', [PostController::class, 'putLike']);
		Route::put('topics/{id}/posts/update', [PostController::class, 'updateByTopic']);
		Route::delete('posts/{id}', [PostController::class, 'deleteIndex']);	
	});
});

//
// public routes
//

Route::get('users/{id}/posts', [PostController::class, 'getByUser']);
Route::get('topics/{id}', [TopicController::class, 'getIndex']);
Route::get('topics/{id}/posts', [PostController::class, 'getByTopic']);
Route::get('topics/{id}/thumb', [TopicController::class, 'getThumbnail']);
Route::get('posts/public', [PostController::class, 'getPublic']);
Route::get('posts/attachments/public', [PostAttachmentController::class, 'getPublic']);
Route::get('posts/{id}', [PostController::class, 'getIndex']);