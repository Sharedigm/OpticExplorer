<?php
/******************************************************************************\
|                                                                              |
|                               PasswordReset.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a password reset.                             |
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

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;

class PasswordReset extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'password_resets';

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
		'key',
		'user_id'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'key',
		'username'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'username'
	];

	//
	// accessor methods
	//

	/**
	 * Get this password reset's username attribute.
	 *
	 * @return string
	 */
	public function getUsernameAttribute(): string {
		$user = User::find($this->user_id);
		if ($user) {
			return $user->username;
		}
	}

	//
	// relationship methods
	//

	/**
	 * Get this item's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
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
		return $query->where('user_id', '=', $userId);
	}
	
	//
	// emailing methods
	//

	/**
	 * Send a password reset by email.
	 *
	 * @param string $passwordResetNonce - the nonce of the password to reset
	 * @return void
	 */
	public function send(string $passwordResetNonce) {
		$user = $this->user;

		// send email
		//
		if (config('mail.enabled')) {
			Mail::send('emails.reset-password', [
				'name' => $user->getFullName(),
				'url' => config('app.client_url') . '/#reset-password/' . $this->id . '/' . $passwordResetNonce,
				'app_name' => config('app.name'),
				'client_url' => config('app.client_url')
			], function($message) use ($user) {
				$message->to($user->getEmail(), $user->getFullName());
				$message->subject('Password Reset');
			});
		}
	}
}
