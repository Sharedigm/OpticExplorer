<?php
/******************************************************************************\
|                                                                              |
|                                  UserHome.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal home information.           |
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

use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\UserOwned;

class UserHome extends TimeStamped
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
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [

		// id attributes
		//
		'id',
		'user_id',

		// location info
		//
		'city', 
		'state', 
		'country',

		// time info
		//
		'from_year',
		'to_year'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// id attributes
		//
		'id',
		'user_id',

		// location info
		//
		'city', 
		'state', 
		'country',

		// time info
		//
		'from_year',
		'to_year'
	];

	//
	// conversion methods
	//

	/**
	 * Convert this item to a string.
	 *
	 * @return string
	 */
	public function toString(): ?string {
		$string = null;
		if ($this->city || $this->state || $this->country) {
			if ($this->city && $this->state) {
				$string = $this->city . ', ' . $this->state;
			}
			if ($this->country) {
				if ($string) {
					$string .= ', ';
				}
				$string .= $this->country;
			}
		}
		return $string;
	}
}