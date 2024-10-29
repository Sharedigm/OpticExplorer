<?php
/******************************************************************************\
|                                                                              |
|                                 comments.php                                 |
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
use App\Http\Controllers\Comments\CommentController;
use App\Http\Controllers\Comments\ReplyController;

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

	// comment routes
	//
	Route::group(['middleware' => 'verify.comment'], function () {
		Route::post('comments', [CommentController::class, 'postCreate']);
		Route::get('comments/{id}', [CommentController::class, 'getIndex']);
		Route::get('comments/{id}/notifications', [CommentController::class, 'getNotifications']);
		Route::put('comments/{id}', [CommentController::class, 'updateIndex']);
		Route::put('comments/{id}/like', [CommentController::class, 'putLike']);
		Route::delete('comments/{id}', [CommentController::class, 'deleteIndex']);
	});

	// reply routes
	//
	Route::group(['middleware' => 'verify.reply'], function () {
		Route::post('replies', [ReplyController::class, 'postCreate']);
		Route::get('replies/{id}', [ReplyController::class, 'getIndex']);
		Route::get('replies/{id}/notifications', [ReplyController::class, 'getNotifications']);
		Route::put('replies/{id}', [ReplyController::class, 'updateIndex']);
		Route::put('replies/{id}/like', [ReplyController::class, 'putLike']);
		Route::delete('replies/{id}', [ReplyController::class, 'deleteIndex']);
	});
});