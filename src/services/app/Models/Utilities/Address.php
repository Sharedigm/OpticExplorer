<?php
/******************************************************************************\
|                                                                              |
|                                   Address.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of address information.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Utilities;

use App\Models\BaseModel;

class Address extends BaseModel
{
	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'street_address',
		'apartment',
		'city',
		'state',
		'postal_code',
		'country'
	];
}
