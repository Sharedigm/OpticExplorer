<?php
/******************************************************************************\
|                                                                              |
|                                   auth.php                                   |
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
use App\Http\Controllers\Auth\SessionController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Users\Accounts\UserAccountController;
use App\Http\Controllers\Users\Accounts\UserIdentityController;
use App\Http\Controllers\Users\Accounts\PasswordResetController;

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

// login routes
//
Route::post('login', [SessionController::class, 'postLogin']);
Route::post('logout', [SessionController::class, 'postLogout']);
Route::get('sessions/{id}', [SessionController::class, 'getIndex']);
Route::put('sessions/start', [SessionController::class, 'putStart']);
Route::get('sessions/{id}/valid', [SessionController::class, 'isValid']);

// password reset routes
//
Route::post('password-resets', [PasswordResetController::class, 'postCreate']);
Route::get('password-resets/{id}/{password_reset_nonce}', [PasswordResetController::class, 'getByIndexAndNonce']);
Route::put('password-resets/reset', [PasswordResetController::class, 'updateByKey']);

// third party login routes
//
Route::get('providers/{provider}/register', [AuthController::class, 'registerWithProvider']);
Route::get('providers/{provider}/login', [AuthController::class, 'loginWithProvider']);
Route::get('providers/{provider}/login/add', [AuthController::class, 'addLoginWithProvider']);
Route::get('providers/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

//
// protected routes
//

Route::group(['middleware' => 'verify.auth'], function() {

	// user routes
	//
	Route::group(['middleware' => 'verify.user'], function() {
		Route::get('users/{id}/logged_in', [SessionController::class, 'isLoggedIn']);
		Route::put('users/{id}/change-password', [UserAccountController::class, 'changePassword']);
	});

	// user identity routes
	//
	Route::group(['middleware' => 'verify.user_identity'], function() {
		Route::get('identities', [UserIdentityController::class, 'getAll']);
		Route::delete('identities/{id}', [UserIdentityController::class, 'deleteIndex']);
	});
});