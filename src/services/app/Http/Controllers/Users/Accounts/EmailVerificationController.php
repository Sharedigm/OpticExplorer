<?php
/******************************************************************************\
|                                                                              |
|                       EmailVerificationController.php                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for user email verification information.         |
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

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Mail;
use App\Models\Users\User;
use App\Models\Users\Accounts\EmailVerification;
use App\Models\Users\Accounts\UserAccount;
use App\Http\Controllers\Controller;
use App\Utilities\Security\Password;
use App\Utilities\Uuids\Guid;

class EmailVerificationController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new email verification.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Users\Accounts\EmailVerification
	 */
	public function postCreate(Request $request) {

		// create new email verification
		//
		$emailVerification = new EmailVerification([
			'id' => Guid::create(),
			'user_id' => $request->input('user_id'),
			'email' => $request->input('email')
		]);
		$emailVerification->save();

		// send email verification
		//
		$emailVerification->send($request->input('verify_route'));
		return $emailVerification;
	}

	//
	// querying methods
	//

	/**
	 * Get an email verification.
	 *
	 * @param string $id - the id of the email verification to get
	 * @return App\Models\Users\Accounts\EmailVerification
	 */
	public function getIndex(string $id) {

		// find email verification by id
		//
		$emailVerification = EmailVerification::find($id);
		if (!$emailVerification) {
			return response("Email verification not found.", 404);
		}

		return $emailVerification;
	}

	//
	// updating methods
	//

	/**
	 * Update an email verification by id.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $id - the id of the email verification to update
	 * @return App\Models\Users\Accounts\EmailVerification
	 */
	public function updateIndex(Request $request, string $id) {

		// find email verification by id
		//
		$emailVerification = EmailVerification::find($id);
		if (!$emailVerification) {
			return response("Email verification not found.", 404);
		}

		// update email verification
		//
		$emailVerification->user_id = $request->input('user_id');
		$emailVerification->id = $request->input('id');
		$emailVerification->email = $request->input('email');
		$emailVerification->save();

		// update user account
		//
		$userAccount = UserAccount::where('user_id', '=', $emailVerification->user_id)->first();
		$userAccount->email_verified_flag = $emailVerification->verified_at ? 1 : 0;
		$userAccount->save();

		return $emailVerification;
	}

	/**
	 * Mark an email verification as verified.
	 *
	 * @param string $id - the id of the email verification to verify
     * @return Illuminate\Http\Response
	 */
	public function putVerify(string $id) {

		// find email verification by id
		//
		$emailVerification = EmailVerification::find($id);
		if (!$emailVerification) {
			return response("Email verification not found.", 404);
		}

		// get user account
		//
		$userAccount = UserAccount::where('user_id', '=', $emailVerification->user_id)->first();
		$userAccount->email = $emailVerification->email;

		$errors = [];
		if (!$userAccount->isValid($errors)) {
			$message = "This request could not be processed due to the following:<br/><br/>";
			$message .= implode('<br/>',$errors);
			$message .= "<br/><br/>If you believe this to be in error or a security issue, please contact an administrator immediately.";
			return response($message, 500);
		}

		// send welcome email if email has never been verified
		//
		if (config('mail.enabled')) {
			if ($userAccount->email_verified_flag != 1) {
				$user = $userAccount->user;
				if ($user) {
					Mail::send('emails.welcome', [
						'name' => $user->getFullName(),
						'app_name' => config('app.name'),
						'client_url' => config('app.client_url')
					], function($message) use ($user) {
						$message->to($user->getEmail(), $user->getFullName());
						$message->subject('Welcome');
					});
				}
			}
		}

		// update user account
		//
		$userAccount->email_verified_flag = 1;
		$userAccount->save();

		// update email verification
		//
		$emailVerification->verified_at = new DateTime();
		$emailVerification->save();

		return response("This email address has been verified.", 200);
	}

	/**
	 * Resend email verification by username and password.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return void
	 */
	public function postResend(Request $request) {

		// get input parameters
		//
		$username = $request->input('username');
		$password = $request->input('password');

		// validate user
		//
		$userAccount = UserAccount::where('username', '=', $username)->first();
		if ($userAccount) {
			if (Password::isValid($password, $userAccount->password)) {

				// get email verification
				//
				$emailVerification = $userAccount->email_verification;

				// resend
				//
				if ($emailVerification) {
					$emailVerification->send('#register/verify-email');
				}
			}
		}
	}

	//
	// deleting methods
	//

	/**
	 * Delete an email verification by id.
	 *
	 * @param string $id - the id of the email verification to delete
	 * @return App\Models\Users\Accounts\EmailVerification
	 */
	public function deleteIndex(string $id) {

		// find email verification by id
		//
		$emailVerification = EmailVerification::find($id);
		if (!$emailVerification) {
			return response("Email verification not found.", 404);
		}

		// delete email verification
		//
		$emailVerification->delete();
		return $emailVerification;
	}
}
