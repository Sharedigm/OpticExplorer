<?php
/******************************************************************************\
|                                                                              |
|                                  UserName.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal name information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Profiles;

use App\Models\BaseModel;
use App\Models\Users\UserOwned;

class UserName extends BaseModel
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
	protected $table = 'user_profiles';

	/**
	 * The primary key for the model.
	 *
	 * @var string
	 */
	public $primaryKey = 'user_id';

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
		'honorific',
		'first_name', 
		'preferred_name', 
		'middle_name', 
		'last_name', 
		'titles'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'honorific',
		'first_name', 
		'preferred_name', 
		'middle_name', 
		'last_name', 
		'titles',
		'full_name'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'full_name'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user name's full name attribute.
	 *
	 * @return string
	 */
	public function getFullNameAttribute(): string {
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
		
		return $name;
	}
}