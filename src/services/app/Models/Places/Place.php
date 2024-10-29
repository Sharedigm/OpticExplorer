<?php
/******************************************************************************\
|                                                                              |
|                                   Place.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a geographical place.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Places;

use App\Models\TimeStamps\TimeStamped;
use App\Models\Places\ItemPlace;

class Place extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'places';

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
		'id',
		'user_id',
		'name',
		'description',
		'latitude',
		'longitude',
		'zoom_level'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'user_id',
		'name',
		'description',
		'latitude',
		'longitude',
		'zoom_level',
		'path',

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
		'path'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'latitude' => 'float',
		'longitude' => 'float',
		'zoom_level' => 'float'
	];

	/**
	 * Get this item's place attribute.
	 *
	 * @return Place
	 */
	public function getPathAttribute(): ?string {
		$itemPlace = ItemPlace::where('place_id', '=', $this->id)->first();
		return $itemPlace? $itemPlace->path : null;
	}
}