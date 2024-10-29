<?php
/******************************************************************************\
|                                                                              |
|                                 TopicInfo.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a post topic.                                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Topics\Info;

use App\Models\TimeStamps\TimeStamped;

class TopicInfo extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'topics';
	
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
		'id',
		'name',
		'public',
		'description',

		// timestamps
		//
		'accepted_at',
		'created_at',
		'updated_at'
	];

	//
	// relationship methods
	//

	/**
	 * Get this item's relationship to its posts.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function post() {
		return $this->hasMany('App\Models\Topics\Post', 'post_id');
	}
}
