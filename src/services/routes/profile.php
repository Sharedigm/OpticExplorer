<?php
/******************************************************************************\
|                                                                              |
|                                 profile.php                                  |
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
use App\Http\Controllers\Users\Profiles\UserProfileController;
use App\Http\Controllers\Users\Profiles\UserHomeController;
use App\Http\Controllers\Users\Profiles\UserJobController;
use App\Http\Controllers\Users\Profiles\UserBookController;
use App\Http\Controllers\Users\Profiles\UserArticleController;
use App\Http\Controllers\Users\Profiles\UserPatentController;
use App\Http\Controllers\Users\Profiles\UserFamilyMemberController;
use App\Http\Controllers\Users\Profiles\UserSchoolController;
use App\Http\Controllers\Users\Profiles\UserAddressController;
use App\Http\Controllers\Users\Profiles\UserPhoneController;
use App\Http\Controllers\Users\Profiles\UserEmailAddrController;
use App\Http\Controllers\Users\Profiles\UserWebsiteController;
use App\Http\Controllers\Users\Profiles\UserAffiliationController;

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

Route::get('users/{id}/profile', [UserProfileController::class, 'getIndex']);
Route::get('users/{id}/profile/photo', [UserProfileController::class, 'getProfilePhoto']);
Route::get('users/{id}/profile/cover-photo', [UserProfileController::class, 'getProfileCoverPhoto']);

//
// protected routes
//

Route::group(['middleware' => 'verify.auth'], function() {

	// user profile routes
	//
	Route::put('users/{id}/profile', [UserProfileController::class, 'updateIndex']);

	// user home routes
	//
	Route::post('users/homes', [UserHomeController::class, 'postCreate']);
	Route::get('users/homes/{id}', [UserHomeController::class, 'getIndex']);
	Route::get('users/{id}/homes', [UserHomeController::class, 'getByUser']);
	Route::put('users/homes/{id}', [UserHomeController::class, 'updateIndex']);
	Route::delete('users/homes/{id}', [UserHomeController::class, 'deleteIndex']);

	// user job routes
	//
	Route::post('users/jobs', [UserJobController::class, 'postCreate']);
	Route::get('users/jobs/{id}', [UserJobController::class, 'getIndex']);
	Route::get('users/{id}/jobs', [UserJobController::class, 'getByUser']);
	Route::put('users/jobs/{id}', [UserJobController::class, 'updateIndex']);
	Route::delete('users/jobs/{id}', [UserJobController::class, 'deleteIndex']);

	// user book routes
	//
	Route::post('users/books', [UserBookController::class, 'postCreate']);
	Route::get('users/books/{id}', [UserBookController::class, 'getIndex']);
	Route::get('users/{id}/books', [UserBookController::class, 'getByUser']);
	Route::put('users/books/{id}', [UserBookController::class, 'updateIndex']);
	Route::delete('users/books/{id}', [UserBookController::class, 'deleteIndex']);

	// user article routes
	//
	Route::post('users/articles', [UserArticleController::class, 'postCreate']);
	Route::get('users/articles/{id}', [UserArticleController::class, 'getIndex']);
	Route::get('users/{id}/articles', [UserArticleController::class, 'getByUser']);
	Route::put('users/articles/{id}', [UserArticleController::class, 'updateIndex']);
	Route::delete('users/articles/{id}', [UserArticleController::class, 'deleteIndex']);

	// user patent routes
	//
	Route::post('users/patents', [UserPatentController::class, 'postCreate']);
	Route::get('users/patents/{id}', [UserPatentController::class, 'getIndex']);
	Route::get('users/{id}/patents', [UserPatentController::class, 'getByUser']);
	Route::put('users/patents/{id}', [UserPatentController::class, 'updateIndex']);
	Route::delete('users/patents/{id}', [UserPatentController::class, 'deleteIndex']);

	// user family routes
	//
	Route::post('users/family', [UserFamilyMemberController::class, 'postCreate']);
	Route::get('users/family/{id}', [UserFamilyMemberController::class, 'getIndex']);
	Route::get('users/{id}/family', [UserFamilyMemberController::class, 'getByUser']);
	Route::put('users/family/{id}', [UserFamilyMemberController::class, 'updateIndex']);
	Route::delete('users/family/{id}', [UserFamilyMemberController::class, 'deleteIndex']);

	// user school routes
	//
	Route::post('users/schools', [UserSchoolController::class, 'postCreate']);
	Route::get('users/schools/{id}', [UserSchoolController::class, 'getIndex']);
	Route::get('users/{id}/schools', [UserSchoolController::class, 'getByUser']);
	Route::put('users/schools/{id}', [UserSchoolController::class, 'updateIndex']);
	Route::delete('users/schools/{id}', [UserSchoolController::class, 'deleteIndex']);

	// user address routes
	//
	Route::post('users/addresses', [UserAddressController::class, 'postCreate']);
	Route::get('users/addresses/{id}', [UserAddressController::class, 'getIndex']);
	Route::get('users/{id}/addresses', [UserAddressController::class, 'getByUser']);
	Route::put('users/addresses/{id}', [UserAddressController::class, 'updateIndex']);
	Route::delete('users/addresses/{id}', [UserAddressController::class, 'deleteIndex']);

	// user phone routes
	//
	Route::post('users/phones', [UserPhoneController::class, 'postCreate']);
	Route::get('users/phones/{id}', [UserPhoneController::class, 'getIndex']);
	Route::get('users/{id}/phones', [UserPhoneController::class, 'getByUser']);
	Route::put('users/phones/{id}', [UserPhoneController::class, 'updateIndex']);
	Route::delete('users/phones/{id}', [UserPhoneController::class, 'deleteIndex']);

	// user email addr routes
	//
	Route::post('users/email-addrs', [UserEmailAddrController::class, 'postCreate']);
	Route::get('users/email-addrs/{id}', [UserEmailAddrController::class, 'getIndex']);
	Route::get('users/{id}/email-addrs', [UserEmailAddrController::class, 'getByUser']);
	Route::put('users/email-addrs/{id}', [UserEmailAddrController::class, 'updateIndex']);
	Route::delete('users/email-addrs/{id}', [UserEmailAddrController::class, 'deleteIndex']);

	// user website routes
	//
	Route::post('users/websites', [UserWebsiteController::class, 'postCreate']);
	Route::get('users/websites/{id}', [UserWebsiteControlle::class, 'getIndex']);
	Route::get('users/{id}/websites', [UserWebsiteController::class, 'getByUser']);
	Route::put('users/websites/{id}', [UserWebsiteController::class, 'updateIndex']);
	Route::delete('users/websites/{id}', [UserWebsiteController::class, 'deleteIndex']);

	// user affiliation routes
	//
	Route::post('users/affiliations', [UserAffiliationController::class, 'postCreate']);
	Route::get('users/affiliations/{id}', [UserAffiliationController::class, 'getIndex']);
	Route::get('users/{id}/affiliations', [UserAffiliationController::class, 'getByUser']);
	Route::put('users/affiliations/{id}', [UserAffiliationController::class, 'updateIndex']);
	Route::delete('users/affiliations/{id}', [UserAffiliationController::class, 'deleteIndex']);
});