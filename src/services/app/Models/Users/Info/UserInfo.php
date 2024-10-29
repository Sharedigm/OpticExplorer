<?php
/******************************************************************************\
|                                                                              |
|                                 UserInfo.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal information. This           |
|        model is used in conjunction with the UserAccount model, which        |
|        stores a user's account information.                                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Info;

use App\Models\TimeStamps\TimeStamped;

class UserInfo extends TimeStamped
{	
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

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
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// user attributes
		//
		'id',

		// appended info
		//
		'short_name',
		'full_name',

		// appended flags
		//
		'has_profile_photo',
		'has_cover_photo',

		// timestamp
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
		'short_name',
		'full_name',
		'username',

		// appended flags
		//
		'has_profile_photo',
		'has_cover_photo'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user's short name attribute.
	 *
	 * @return string
	 */
	public function getShortNameAttribute(): string {
		return $this->getShortName();
	}

	/**
	 * Get this user's full name attribute.
	 *
	 * @return string
	 */
	public function getFullNameAttribute(): string {
		return $this->getFullName();
	}

	/**
	 * Get this user's 'has profile photo' attribute.
	 *
	 * @return bool
	 */
	public function getHasProfilePhotoAttribute(): bool {
		return $this->hasProfilePhoto();
	}

	/**
	 * Get this user's 'has cover photo' attribute.
	 *
	 * @return bool
	 */
	public function getHasCoverPhotoAttribute(): bool {
		return $this->hasCoverPhoto();
	}

	//
	// relationship methods
	//
	
	/**
	 * Get this users's relationship to its profile.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function profile() {
		return $this->hasOne('App\Models\Users\Profiles\UserProfile', 'user_id');
	}

	//
	// querying methods
	//

	/**
	 * Get this users's short name.
	 *
	 * @return string
	 */
	public function getShortName(): string {
		$name = '';

		if ($this->preferred_name) {
			$name .= $this->preferred_name;
		} else {
			$name .= $this->first_name;
		}
		if ($this->last_name) {
			$name .= ' ' . $this->last_name;
		}

		return ucwords($name);
	}

	/**
	 * Get this users's full name.
	 *
	 * @return string
	 */
	public function getFullName(): string {
		$name = '';

		if ($this->honorific) {
			$name .= $this->honorific . ' ';
		}
		if ($this->first_name) {
			$name .= $this->first_name;
		}
		if ($this->preferred_name) {
			$name .= ' (' . $this->preferred_name . ')';
		}
		if ($this->middle_name) {
			$name .= ' ' . $this->middle_name;
		}
		if ($this->last_name) {
			$name .= ' ' . $this->last_name;
		}
		if ($this->titles) {
			$name .= ' ' . $this->titles;
		}
		
		return ucwords($name);
	}

	/**
	 * Whether or not this user has a profile photo.
	 *
	 * @return bool
	 */
	public function hasProfilePhoto(): bool {
		return $this->profile? $this->profile->profile_photo_path != null : false;
	}

	/**
	 * Whether or not this user has a cover photo.
	 *
	 * @return bool
	 */
	public function hasCoverPhoto(): bool {
		return $this->profile? $this->profile->cover_photo_path != null : false;
	}
}
