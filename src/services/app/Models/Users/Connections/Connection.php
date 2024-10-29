<?php
/******************************************************************************\
|                                                                              |
|                                Connection.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's connection.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Connections;

use App\Models\Users\User;
use App\Models\Users\Profiles\UserLocation;
use App\Models\Users\Profiles\UserJob;
use App\Models\Places\CheckIn;
use Illuminate\Notifications\Notifiable;

class Connection extends User
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use Notifiable;

	//
	// attributes
	//

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [

		// connection info
		//
		'connection_request_id',
		'accepted_at'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// user attributes
		//
		'id',

		// user name
		//
		'honorific',
		'first_name',
		'preferred_name',
		'middle_name',
		'last_name',
		'titles',

		// connection info
		//
		'connection_request_id',
		'accepted_at',

		// appended info
		//
		'username',
		'short_name',
		'full_name',
		'birth_date',
		'gender',
		'location',
		'occupation',
		'check_in',
		'email',

		// appended flags
		//
		'is_current',
		'is_connection',
		'is_admin',
		'is_online',
		'is_active',
		'has_profile_photo',
		'has_cover_photo',
		'last_login_at',

		// timestamps
		//
		'created_at',
		'updated_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'username',
		'short_name',
		'full_name',
		'birth_date',
		'gender',
		'location',
		'occupation',
		'check_in',

		// appended flags
		//
		'is_current',
		'is_connection',
		'is_admin',
		'is_online',
		'is_active',
		'has_profile_photo',
		'has_cover_photo',
		'last_login_at'
	];

	//
	// accessor methods
	//

	/**
	 * Get this connection's birth date attribute.
	 *
	 * @return string
	 */
	public function getBirthDateAttribute(): ?string {
		return $this->getBirthDate();
	}

	/**
	 * Get this user's email attribute.
	 *
	 * @return string
	 */
	public function getEmailAttribute(): ?string {
		return $this->getEmail();
	}

	/**
	 * Get this user's last_login_at attribute.
	 *
	 * @return string
	 */
	public function getLastLoginAtAttribute() {
		return $this->account->ultimate_login_at;
	}

	/**
	 * Get this user's check-in attribute.
	 *
	 * @return App\Models\Places\CheckIn
	 */
	public function getCheckInAttribute() {
		return CheckIn::where('user_id', '=', $this->id)
			->whereNull('checked_out_at')
			->orderBy('created_at', 'DESC')
			->first();
	}

	//
	// relationship methods
	//

	/**
	 * Get this item's relationship to its user account.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function account() {
		return $this->hasOne('App\Models\Users\Accounts\UserAccount', 'user_id');
	}

	/**
	 * Get this item's relationship to its user profile.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function profile() {
		return $this->hasOne('App\Models\Users\Profiles\UserProfile', 'user_id');
	}

	/**
	 * Get this item's relationship to its user settings.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function settings() {
		return $this->hasMany('App\Models\Settings\UserSetting', 'user_id');
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
}