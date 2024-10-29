<?php
/******************************************************************************\
|                                                                              |
|                           UserProfileController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users' personal profile information.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Profiles;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use App\Models\Storage\Media\ImageFile;
use App\Models\Users\User;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Users\Profiles\UserProfile;
use App\Models\Storage\Sharing\Share;
use App\Http\Controllers\Controller;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Strings\StringUtils;

class UserProfileController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get a user's profile.
	 *
	 * @param string $userId - the id of the user to get a profile belonging to
	 * @return App\Models\Users\Profiles\UserProfile
	 */
	public function getIndex(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}

		// find user' profile
		//
		$userProfile = UserProfile::belongingTo($userId)->first();
		if (!$userProfile) {
			return response("User's profile not found.", 404);
		}

		return $userProfile;
	}

	/**
	 * Get a user's profile photo.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get a profile photo belonging to
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getProfilePhoto(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// parse params
		//
		$minSize = $request->input('min_size');
		$maxSize = $request->input('max_size');

		// check if profile photo is defined
		//
		$userProfile = UserProfile::find($userId);
		if (!$userProfile->profile_photo_path) {
			return response("Profile photo not defined.", 404);
		}

		// set user context
		//
		if (!str_starts_with($userProfile->profile_photo_path, '/')) {
			$userAccount = UserAccount::find($userId);
			FileStorage::setUserContext($userAccount);
		}

		// return file info
		//
		$file = new ImageFile([
			'path' => $userProfile->profile_photo_path
		]);

		// return existing image
		//
		if ($file->getExtension() == 'svg') {
			return $file->response('svg');
		}

		// get / create thumbnail
		//
		return $file->getThumbnail($minSize, $maxSize);
	}

	/**
	 * Get a user's profile cover photo.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to get a profile cover photo belonging to
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getProfileCoverPhoto(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// parse params
		//
		$width = $request->input('width');
		$height = $request->input('height');
		$minSize = $request->input('min_size');
		$maxSize = $request->input('max_size');

		// check if cover photo is defined
		//
		$userProfile = UserProfile::find($userId);
		if (!$userProfile->cover_photo_path) {
			return response("Profile photo not defined.", 404);
		}

		// check for shared item
		//
		$share = Share::where('user_id', '=', $userId)
			->where('path', '=', $userProfile->cover_photo_path)
			->first();

		// check for shared parent directory
		//
		if (!$share) {
			$dirname = dirname($userProfile->cover_photo_path);
			if ($dirname) {
				$share = Share::where('user_id', '=', $userId)
					->where('path', '=', $dirname . '/')
					->first();	
			}
		}

		// create image file
		//
		if (!StringUtils::startsWith($userProfile->cover_photo_path, '/')) {
			$userAccount = UserAccount::find($userId);
			if ($userAccount->isAdmin()) {

				// admin cover photos
				//
				$file = new ImageFile([
					'path' => $userProfile->cover_photo_path
				]);
			} else if ($share) {

				// shared cover photos
				//
				$file = new ImageFile([
					'path' => $userProfile->cover_photo_path,
					'share_id' => $share->id
				]);	
			} else {

				// user cover photos
				//
				$file = new ImageFile([
					'path' => $userAccount->username . '/' . $userProfile->cover_photo_path
				]);
			}
		} else {
			$file = new ImageFile([
				'path' => $userProfile->cover_photo_path
			]);
		}

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// get file extension
		//
		$extension = $file->getExtension();
		$responseType = ImageFile::getResponseType($extension);
		
		// find if we are resizing or reformatting the image
		//
		$resize = $width || $height || $minSize || $maxSize;
		$reformat = (strtolower($extension) != $responseType);

		if ($resize || $reformat) {
			return $file->readImage($width, $height, $minSize, $maxSize)->response($responseType);
		} else {
			return $file->response($responseType);
		}
	}

	//
	// updating methods
	//

	/**
	 * Update a user's profile.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userId - the id of the user to update the profile belonging to
	 * @return object
	 */
	public function updateIndex(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// get general parameters
		//
		$profilePhotoPath = $request->has('profile_photo_path')? $request->input('profile_photo_path') : null;
		$coverPhotoPath = $request->has('cover_photo_path')? $request->input('cover_photo_path') : null;
		$bio = $request->has('bio')? $request->input('bio') : null;
		$birthDate = $request->has('birth_date')? $request->input('birth_date') : null;
		$gender = $request->has('gender')? $request->input('gender') : null;

		// get preference parameters
		//
		$interests = $request->has('interests')? $request->input('interests') : null;
		$likes = $request->has('likes')? $request->input('likes') : null;
		$dislikes = $request->has('dislikes')? $request->input('dislikes') : null;

		// get talent parameters
		//
		$skills = $request->has('skills')? $request->input('skills') : null;
		$experiences = $request->has('experiences')? $request->input('experiences') : null;
		$goals = $request->has('goals')? $request->input('goals') : null;

		// adjust admin paths
		//
		/*
		$userAccount = UserAccount::where('user_id', '=', $userId)->first();
		if ($userAccount && $userAccount->isAdmin()) {
			$profilePhotoPath = ltrim($profilePhotoPath, $userAccount->username . '/');
			$coverPhotoPath = ltrim($coverPhotoPath, $userAccount->username . '/');	
		}
		*/

		// collapse preferences to comma separated strings
		//
		if ($interests && $interests != '') {
			$interests = implode(',', $interests);
		}
		if ($likes && $likes != '') {
			$likes = implode(',', $likes);
		}
		if ($dislikes && $dislikes != '') {
			$dislikes = implode(',', $dislikes);
		}

		// collapse talents to comma separated strings
		//
		if ($skills && $skills != '') {
			$skills = implode(',', $skills);
		}
		if ($experiences && $experiences != '') {
			$experiences = implode(',', $experiences);
		}
		if ($goals && $goals != '') {
			$goals = implode(',', $goals);
		}

		// find user's profile
		//
		$userProfile = UserProfile::belongingTo($userId)->first();
		if (!$userProfile) {
			return response("User's profile not found.", 404);
		}

		// update user profile
		//
		return $userProfile->change([

			// profile photos
			//
			'profile_photo_path' => $profilePhotoPath,
			'cover_photo_path' => $coverPhotoPath,

			// personal info
			//
			'bio' => $bio,
			'birth_date' => $birthDate,
			'gender' => $gender,

			// preferences
			//
			'interests' => $interests,
			'likes' => $likes,
			'dislikes' => $dislikes,

			// talents
			//
			'skills' => $skills,
			'experiences' => $experiences,
			'goals' => $goals
		]);
	}
}