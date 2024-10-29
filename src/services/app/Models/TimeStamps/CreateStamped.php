<?php
/******************************************************************************\
|                                                                              |
|                               CreateStamped.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a base class with create time stamps.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\TimeStamps;

use App\Models\BaseModel;
use DateTime;

class CreateStamped extends BaseModel
{
	// use non-standard timestamp field names
	//
	const CREATED_AT = 'created_at';

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// timestamps
		//
		'created_at'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'created_at' => 'datetime'
	];
}