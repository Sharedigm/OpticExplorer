<?php
/******************************************************************************\
|                                                                              |
|                                   users.php                                  |
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
use App\Http\Controllers\Users\UserController;
use App\Http\Controllers\Users\Accounts\UserAccountController;
use App\Http\Controllers\Users\Friends\UserInvitationController;
use App\Http\Controllers\Users\Accounts\EmailVerificationController;
use App\Http\Controllers\Utilities\ContactController;
use App\Http\Controllers\Proxy\ProxyController;
use App\Http\Controllers\Notifications\NotificationController;

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

// validation / verification routes
//
Route::post('users/accounts/validate', [UserAccountController::class, 'postValidate']);

// public user routes
//
Route::get('users/{id}', [UserController::class, 'getIndex']);
Route::post('users', [UserController::class, 'postCreate']);
Route::post('users/email/request-username', [UserAccountController::class, 'requestUsername']);
Route::get('users/invitations/{id}', [UserInvitationController::class, 'getIndex']);
Route::get('users/names/{username}', [UserController::class, 'getByUsername']);
Route::get('users/email/{email}', [UserController::class, 'getByEmail']);

// email verification routes
//
Route::group(['middleware' => 'verify.email_verification'], function() {
	Route::post('verifications', [EmailVerificationController::class, 'postCreate']);
	Route::post('verifications/resend', [EmailVerificationController::class, 'postResend']);
	Route::get('verifications/{key}', [EmailVerificationController::class, 'getIndex']);
	Route::put('verifications/{key}', [EmailVerificationController::class, 'updateIndex']);
	Route::put('verifications/{key}/verify', [EmailVerificationController::class, 'putVerify']);
	Route::delete('verifications/{key}', [EmailVerificationController::class, 'deleteIndex']);
});

// contact form routes
//
Route::post('contacts', [ContactController::class, 'postCreate']);

// proxy routes
//
Route::get('proxy', [ProxyController::class, 'getUrl']);
Route::get('proxy/source', [ProxyController::class, 'getUrlSource']);
Route::get('proxy/headers', [ProxyController::class, 'getUrlHeaders']);

//
// protected routes
//

Route::group(['middleware' => 'verify.auth'], function() {
	
	// user routes
	//
	Route::group(['middleware' => 'verify.user'], function() {
		Route::put('users/{id}', [UserController::class, 'updateIndex']);
		Route::delete('users/{id}', [UserController::class, 'deleteIndex']);
	});

	// user invitations route
	//
	Route::post('users/invitations', [UserInvitationController::class, 'postCreate']);

	// file system access routes
	//
	Route::group(['middleware' => 'verify.storage_access'], function() {

		// user account routes
		//
		Route::get('users/{id}/account', [UserAccountController::class, 'getIndex']);
		Route::put('users/{id}/account', [UserAccountController::class, 'updateIndex']);
	});

	// notification routes
	//
	Route::get('notifications', [NotificationController::class, 'getCurrent']);
	Route::get('notifications/{id}', [NotificationController::class, 'getIndex']);
	Route::put('notifications/{id}/dismiss', [NotificationController::class, 'dismissIndex']);
});