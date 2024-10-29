<?php
/******************************************************************************\
|                                                                              |
|                              UserInvitation.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a new user invitation.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Sharing;

use App\Models\TimeStamps\TimeStamped;
use Illuminate\Support\Facades\Mail;
use App\Models\Users\User;

class UserInvitation extends TimeStamped
{
	//
	// attibutes
	//

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'user_invitations';

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
		'inviter_id',
		'invitee_name',
		'invitee_email',
		'message'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'inviter',
		'invitee_name',
		'invitee_email',
		'message'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'inviter'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user invitation's inviter attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getInviterAttribute() {
		return User::where('id', '=', $this->inviter_id)->first();
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, string $userId) {
		return $query->where('id', '=', $userId);
	}
	
	//
	// methods
	//

	/**
	 * Send a user invitation by email.
	 *
	 * @param string $registrationUrl - the url to use to register a new acount
	 * @return bool
	 */
	public function send(string $registrationUrl) {
		$inviter = User::where('id', '=', $this->inviter_id)->first();
		$inviteeEmail = $this->invitee_email;

		// send email
		//
		if (config('mail.enabled')) {
			Mail::send('emails.user-invitation', [
				'inviter_name' => $inviter->getFullName(),
				'invitee_name' => $this->invitee_name,
				'inviter_message' => $this->message,
				'registration_url' => $registrationUrl,
				'app_name' => config('app.name'),
				'client_url' => config('app.client_url')
			], function($message) use ($inviter, $inviteeEmail) {
				$message->to($inviteeEmail);
				$message->subject('Connection Invitation');
			});
		}
	}
}
