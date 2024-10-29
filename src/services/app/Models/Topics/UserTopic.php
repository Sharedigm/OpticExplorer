<?php
/******************************************************************************\
|                                                                              |
|                                 UserTopic.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's post topic.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Topics;

use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\UserOwned;

class UserTopic extends TimeStamped
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
	protected $table = 'user_topics';
	
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
		'topic_id'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'user_id',
		'topic_id',

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
	 * Get this item's relationship to its post topic.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function topic() {
		return $this->belongsTo('App\Models\Topics\Topic', 'topic_id');
	}
}