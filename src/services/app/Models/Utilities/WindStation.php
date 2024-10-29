<?php
/******************************************************************************\
|                                                                              |
|                                WindStation.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a wind weather station.                       |
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

class WindStation extends BaseModel
{
	//
	// attributes
	//

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'wind_stations';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'station_id',
		'latitude',
		'longitude'
	];
}
