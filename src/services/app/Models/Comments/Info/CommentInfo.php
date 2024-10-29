<?php
/******************************************************************************\
|                                                                              |
|                               CommentInfo.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a simplified model of a comment on a post.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Comments\Info;

use Illuminate\Support\Collection;
use App\Models\Topics\Info\PostInfo;
use App\Models\Users\Info\UserInfo;

class CommentInfo extends PostInfo
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'comments';

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
		'user',
		'post_id',
		'message',

		// timestamps
		//
		'accepted_at',
		'created_at',
		'updated_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'user'
	];

	//
	// accessor methods
	//

	/**
	 * Get this like's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): UserInfo {
		return UserInfo::find($this->user_id);
	}
}
