<?php
/******************************************************************************\
|                                                                              |
|                                 messages.php                                 |
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
use App\Http\Controllers\Chats\ChatController;
use App\Http\Controllers\Chats\ChatMessageController;
use App\Http\Controllers\Chats\Sharing\ChatInvitationController;
use App\Http\Controllers\Gestures\GestureController;

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

	// chat invitation routes
	//
	Route::post('chats/invitations', [ChatInvitationController::class, 'postCreate']);
	Route::get('chats/invitations/{id}', [ChatInvitationController::class, 'getIndex']);
	Route::put('chats/invitations/{id}/accept', [ChatInvitationController::class, 'acceptIndex']);
	Route::put('chats/invitations/{id}/decline', [ChatInvitationController::class, 'declineIndex']);
	Route::get('chats/{id}/invitations', [ChatInvitationController::class, 'getByChat']);
	
	// chat routes
	//
	Route::group(['middleware' => 'verify.chat'], function () {
		Route::post('chats', [ChatController::class, 'postCreate']);
		Route::get('chats', [ChatController::class, 'getAll']);
		Route::get('chats/{id}', [ChatController::class, 'getIndex']);
		Route::put('chats/{id}', [ChatController::class, 'updateIndex']);
		Route::delete('chats/{id}', [ChatController::class, 'deleteIndex']);
	});

	// chat message routes
	//
	Route::group(['middleware' => 'verify.chat_message'], function () {
		Route::post('chats/messages', [ChatMessageController::class, 'postCreate']);
		Route::get('chats/messages/{id}', [ChatMessageController::class, 'getIndex']);
		Route::put('chats/messages/{id}', [ChatMessageController::class, 'updateIndex']);
		Route::delete('chats/messages/{id}', [ChatMessageController::class, 'deleteIndex']);
	});

	// chat messages routes
	//
	Route::get('chats/{id}/messages', [ChatMessageController::class, 'getByChat']);
	Route::get('chats/{id}/messages/sent', [ChatMessageController::class, 'getSentByChat']);
	Route::get('chats/{id}/messages/received', [ChatMessageController::class, 'getReceivedByChat']);
	Route::put('chats/{id}/messages/update', [ChatMessageController::class, 'updateByChat']);

	// chat member routes
	//
	Route::get('chats/{id}/members', [ChatController::class, 'getMembers']);
	Route::put('chats/{id}/members/{memberId}/remove', [ChatController::class, 'removeMember']);

	// gesture routes
	//
	Route::post('gestures', [GestureController::class, 'postCreate']);
	Route::get('gestures/{id}', [GestureController::class, 'getIndex']);
	Route::put('gestures/{id}', [GestureController::class, 'updateIndex']);
	Route::delete('gestures/{id}', [GestureController::class, 'deleteIndex']);
});