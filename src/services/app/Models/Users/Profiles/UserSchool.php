<?php
/******************************************************************************\
|                                                                              |
|                                 UserSchool.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal school information.         |
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

class UserSchool extends TimeStamped
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
	protected $table = 'user_schools';

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

		// school info
		//
		'school_name', 
		'school_website',
		'city',
		'state',
		'country',

		// term info
		//
		'degree',
		'from_grade_level', 
		'to_grade_level', 
		'from_year',
		'to_year',
		'major_subject',
		'minor_subject',

		// extracurricular info
		//
		'sports',
		'clubs',
		'activities',
		'honors'
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

		// school info
		//
		'school_name', 
		'school_website', 
		'city',
		'state',
		'country',

		// term info
		//
		'degree',
		'from_grade_level', 
		'to_grade_level', 
		'from_year',
		'to_year',
		'major_subject',
		'minor_subject',

		// extracurricular info
		//
		'sports',
		'clubs',
		'activities',
		'honors'
	];

	//
	// conversion methods
	//

	/**
	 * Convert this item to a string.
	 *
	 * @return string
	 */
	public function toString(): string {
		$string = '';
		if ($this->school_name) {
			$string .= $this->school_name;
		}
		if ($this->degree) {
			if ($string) {
				$string .= ', ';
			}
			$string .= $this->degree;
		}
		return $string;
	}
}