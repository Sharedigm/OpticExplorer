<?php
/******************************************************************************\
|                                                                              |
|                             EmailVerification.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an email verification.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Accounts;

use Illuminate\Support\Facades\Mail;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\UserOwned;
use App\Models\Users\User;

class EmailVerification extends TimeStamped
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use UserOwned;

	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'email_verifications';

	/**
	 * Indicates if the IDs are auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * The "type" of the primary key ID.
	 *
	 * @var string
	 */
	protected $keyType = 'string';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id', 
		'user_id', 
		'email',

		// timestamps
		//
		'verified_at'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'user',
		'email'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'user'
	];

	//
	// accessor methods
	//

	/**
	 * Get this email verification's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	//
	// relationship methods
	//

	/**
	 * Get this item's relationship to its user account.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function userAccount() {
		return $this->belongsTo('App\Models\Users\Accounts\UserAccount', 'user_id');
	}
	
	//
	// querying methods
	//

	/**
	 * Return whether or not an email verification has been verified.
	 *
	 * @return bool
	 */
	public function isVerified(): bool {
		return ($this->verified_at != null);
	}

	//
	// emailing methods
	//

	/**
	 * Send a user verification email.
	 *
	 * @param string $verifyRoute - the route to call to verify the user.
	 * @param bool $changed - whether or not we are re-verifying an email address.
	 * @return bool
	 */
	public function send(string $verifyRoute, bool $changed = false) {
		$template = $changed ? 'emails.email-verification' : 'emails.user-verification';
		$subject = $changed ? 'Email Verification'  : 'User Verification';
		$recipient = User::find($this->user_id);

		if ($recipient->hasEmail()) {

			// send email
			//
			if (config('mail.enabled')) {
				Mail::send($template, [
					'name' => $recipient->getFullName(),
					'url' => config('app.client_url') . '/' . $verifyRoute . '/' . $this->id,
					'app_name' => config('app.name'),
					'client_url' => config('app.client_url')
				], function($message) use ($subject, $recipient) {
					$message->to($this->email, $recipient->getFullName());
					$message->subject($subject);
				});
			}
			
			return true;
		} else {
			return false;
		}
	}
}