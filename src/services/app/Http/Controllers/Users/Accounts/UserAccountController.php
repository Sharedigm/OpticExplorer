<?php
/******************************************************************************\
|                                                                              |
|                           UserAccountController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for users's personal account information.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Users\Accounts;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Models\Users\User;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Users\Accounts\EmailVerification;
use App\Http\Controllers\Controller;
use App\Utilities\Security\Password;
use App\Utilities\Uuids\Guid;

class UserAccountController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Validate a user's account.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function postValidate(Request $request) {
		$errors = [];

		// create new user's account
		//
		$userAccount = new UserAccount([
			'user_id' => $request->input('user_id'),
			'username' => $request->input('username'),
			'email' => $request->input('email')
		]);

		// if username matches current user, check email address only
		//
		$currentUser =  User::current();
		if ($currentUser && $userAccount->username == $currentUser->account->username) {

			// check email validation
			//
			if (UserAccount::emailInUse($userAccount->email)) {
				return response(json_encode($errors), 409);
			}

		// if email matches current user, check username only
		//
		} else if ($currentUser && $userAccount->email == $currentUser->account->email) {

			// check email validation
			//
			if (UserAccount::usernameInUse($userAccount->username)) {
				return response(json_encode($errors), 409);
			}

		// check both username and email
		//
		} else {

			// check account validation
			//
			if (!$userAccount->isTaken($errors)) {
				return response(json_encode($errors), 409);
			}
		}

		// return response
		//
		return response()->json([
			'success' => true
		]);
	}

	/**
	 * Get a user's account.
	 *
	 * @param string $userId - the id of the user to get the account of
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public function getIndex(string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// find user acccount belonging to user
		//
		return UserAccount::belongingTo($userId)->first();
	}

	/**
	 * Get a user's account by username.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public function getByUsername(Request $request) {

		// get parameters
		//
		$username = $request->input('username');

		// get user's account
		//
		$userAccount = UserAccount::byUsername($username)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the username: " . $username, 404);
		}

		return $userAccount;
	}

	/**
	 * Get a user's account by email address.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public function getByEmail(Request $request) {

		// get parameters
		//
		$email = $request->input('email');

		// get user's account
		//
		$userAccount = UserAccount::byEmail($email)->first();
		if (!$userAccount) {
			return response("Could not find a user account associated with the email address: " . $email, 404);
		}

		return $userAccount;
	}

	/**
	 * Send a user's username.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function requestUsername(Request $request) {

		// get parameters
		//
		$email = $request->input('email');

		// query database
		//
		$userAccount = UserAccount::where('email', '=', $email)->first();
		
		// return error if email is not enabled
		//
		if (!config('mail.enabled')) {
			return response("Email has not been enabled.", 400);
		}
		
		// send email notification
		//
		if ($userAccount) {
			$user = $userAccount->user;

			Mail::send('emails.request-username', [
				'name' => $user->getFullName(),
				'username' => $userAccount->username,
				'app_name' => config('app.name'),
				'client_url' => config('app.client_url')
			], function($message) use ($user) {
				$message->to($user->getEmail(), $user->getFullName());
				$message->subject('Username Request');
			});
		}

		// return response
		//
		return response()->json([
			'success' => true
		]);
	}

	//
	// updating methods
	//

	/**
	 * Update a user's account.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string @userId - the id of the user to update the account of
	 * @return App\Models\Users\Accounts\UserAccount
	 */
	public function updateIndex(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// get parameters
		//
		$username = $request->input('username');
		$email = $request->input('email');
		$enabledFlag = $request->input('enabled_flag');
		$emailVerifiedFlag = $request->input('email_verified_flag');
		$adminFlag = $request->input('admin_flag');

		// find user account by id
		//
		$userAccount = UserAccount::find($userId);
		if (!$userAccount) {
			return response("User account not found.", 404);
		}

		// check if username has changed
		//
		if ($userAccount->username != $username) {

			// check to see if username is already in use
			//
			if (UserAccount::where('username', '=', $username)->exists()) {
				return response("Username is already in use.", 400);
			} else if (Storage::exists($username)) {
				return response("File or directory already exists with this username.", 400); 
			}

			// change name of user directory
			//
			Storage::move($userAccount->username, $username);
			
			// update user account
			//
			$userAccount->change([
				'username' => $username
			]);
		}

		// check if email has changed
		//
		if ($userAccount->email != $email) {
			if (!$userAccount->isAdmin()) {

				// send verification email
				//
				$emailVerification = new EmailVerification([
					'id' => Guid::create(),
					'user_id' => $userAccount->user_id,
					'email' => $email
				]);
				$emailVerification->save();
				$emailVerification->send('#verify-email', true);
			} else {

				// update user account
				//
				$userAccount->change([
					'email' => $email
				]);
			}
		}

		// set user account admin attributes
		//
		$currentUser = User::current();
		if ($currentUser->isAdmin()) {
			$userAccount->setAttributes([
				'enabled_flag' => $enabledFlag,
				'email_verified_flag' => $emailVerifiedFlag,
				'admin_flag' => $adminFlag
			]);
		}

		return $userAccount;
	}

	/**
	 * Send password change notification email.
	 *
	 * @param App\Models\Users\User $user - the user to notify
	 * @return void
	 */
	public function sendPasswordChangeNotification(User $user) {
		if (config('mail.enabled') && $user->hasEmail()) {
			Mail::send('emails.password-changed', [
				'name' => $user->getFullName(),
				'app_name' => config('app.name'),
				'client_url' => config('app.client_url')
			], function($message) use ($user) {
				$message->to($user->getEmail(), $user->getFullName());
				$message->subject('Password Changed');
			});
		}
	}

	/**
	 * Change a user's password.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string @userId - the id of the user to change the password of
	 * @return \Illuminate\Http\Response
	 */
	public function changePassword(Request $request, string $userId) {

		// get current user
		//
		if ($userId == 'current') {
			$userId = Session::get('user_id');
		}
		
		// get parameters
		//
		$oldPassword = $request->input('old_password');
		$newPassword = $request->input('new_password');

		// find user account by id
		//
		$userAccount = UserAccount::find($userId);
		if (!$userAccount) {
			return response("User account not found.", 404);
		}

		// get users
		//
		$user = $userAccount->user;
		$currentUser = User::current();
		$currentUserAccount = $currentUser->account;

		// check if current user is an admin
		//
		if ($currentUserAccount->isAdmin() && !$user->isCurrent()) {
			
			// change password
			//
			$userAccount->modifyPassword($newPassword);

			// send password change notification email
			//
			$this->sendPasswordChangeNotification($user);

			// return success
			//
			return response()->json([
				'success' => true
			]);

		// current user is not an admin
		//
		} else if ($user->isCurrent()) {
			if (Password::isValid($oldPassword, $userAccount->password)) {

				// change password
				//
				$userAccount->modifyPassword($newPassword);

				// send password change notification email
				//
				$this->sendPasswordChangeNotification($user);

				// return success
				//
				return response()->json([
					'success' => true
				]);
			} else {

				// old password is not valid
				//
				return response("Old password is incorrect.", 404);
			}

		// current user is not the target user
		//
		} else {
			return response("You must be an admin to change a user's password", 403);
		}
	}
}