<?php
/******************************************************************************\
|                                                                              |
|                                ItemPlace.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a file system item's geolocation.             |
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
use App\Models\Places\Place;

class ItemPlace extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'item_places';

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

		// attributes
		//
		'id',

		// target attributes
		//
		'user_id',
		'place_id',
		'path'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// attributes
		//
		'id',

		// target attributes
		//
		'place',
		'path'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'place'
	];

	/**
	 * Get this item's place attribute.
	 *
	 * @return Place
	 */
	public function getPlaceAttribute(): ?Place {
		return Place::find($this->place_id);
	}

	//
	// relationship methods
	//

	/**
	 * Get this share request's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}
}