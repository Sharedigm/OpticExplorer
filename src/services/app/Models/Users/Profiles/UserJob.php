<?php
/******************************************************************************\
|                                                                              |
|                                  UserJob.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal job information.            |
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

class UserJob extends TimeStamped
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
	protected $table = 'user_jobs';

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

		// who
		//
		'company_name', 
		'company_website', 
		'division',

		// what
		//
		'title',
		'description',

		// when
		//
		'from_date', 
		'to_date',

		// where
		//
		'city',
		'state',
		'country',

		// why / how
		//
		'achievements',
		'awards',
		'skills'
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

		// who
		//
		'company_name', 
		'company_website', 
		'division',

		// what
		//
		'title',
		'description',

		// when
		//
		'from_date', 
		'to_date',

		// where
		//
		'city',
		'state',
		'country',

		// why / how
		//
		'achievements',
		'awards',
		'skills'
	];
	
	//
	// conversion methods
	//

	public function convertAttrs(array $attributes) {
		foreach ($attributes as $key => $value) {
			switch ($key) {

				// convert dates
				//
				case 'from_date':
				case 'to_date':
					$attributes[$key] = $attributes[$key] != '0000-00-00'? $attributes[$key]: null;
					break;
			}
		}
		return $attributes;
	}

	//
	// overridden methods
	//

	/**
	 * Update this object's attributes.
	 *
	 * @return array
	 */
	public function change(array $attributes = []): array {
		return $this->convertAttrs(parent::change($attributes));
	}

	//
	// conversion methods
	//

	/**
	 * Convert this item to an array.
	 *
	 * @return array
	 */
	public function toArray(): array {
		return $this->convertAttrs(parent::toArray());
	}

	/**
	 * Convert item to a string.
	 *
	 * @return string
	 */
	public function toString(): ?string {
		$string = null;
		if ($this->title) {
			$string = $this->title;
			if ($this->company_name) {
				if ($string) {
					$string .= ' at ';
				}
				$string .= $this->company_name;
			}
		}
		return $string;
	}
}