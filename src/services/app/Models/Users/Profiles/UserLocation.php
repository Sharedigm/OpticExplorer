<?php
/******************************************************************************\
|                                                                              |
|                                UserLocation.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal location information.       |
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

class UserLocation extends BaseModel
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
	protected $table = 'user_homes';

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
		'city',
		'state',
		'country'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'city',
		'state',
		'country'
	];

	//
	// accessor methods
	//

	/**
	 * Get this user location's city attribute.
	 *
	 * @return string
	 */
	public function getCityAttribute(): ?string {
		$home = $this->getMostRecentHome();
		return $home? $home->city : null;
	}

	/**
	 * Get this user location's state attribute.
	 *
	 * @return string
	 */
	public function getStateAttribute(): ?string {
		$home = $this->getMostRecentHome();
		return $home? $home->state : null;
	}

	/**
	 * Get this user location's country attribute.
	 *
	 * @return string
	 */
	public function getCountryAttribute(): ?string {
		$home = $this->getMostRecentHome();
		return $home? $home->country : null;
	}

	//
	// querying methods
	//

	public function getMostRecentHome(): ?UserHome {
		return UserHome::where('user_id', '=', $this->user_id)
			->orderBy('from_year', 'desc')
			->first();
	}

	/**
	 * Convert item to a string.
	 *
	 * @return string
	 */
	public function toString(): ?string {
		$home = $this->getMostRecentHome();
		return $home? $home->toString() : null;
	}
}