<?php
/******************************************************************************\
|                                                                              |
|                                 PostInfo.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a simplified model of a post.                            |
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

use Illuminate\Support\Collection;
use App\Models\BaseModel;
use App\Models\Topics\Post;
use App\Models\Users\Info\UserInfo;

class PostInfo extends BaseModel
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'posts';

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
		'message',
		'public',
		'num_likes',
		'num_comments',

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
		'user',
		'num_likes',
		'num_comments'
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

	/**
	 * Get this post's num likes attribute.
	 *
	 * @return int
	 */
	public function getNumLikesAttribute(): int {
		return $this->post->num_likes;
	}

	/**
	 * Get this post's num comments attribute.
	 *
	 * @return int
	 */
	public function getNumCommentsAttribute(): int {
		return $this->post->num_comments;
	}

	//
	// relationship methods
	//

	/**
	 * Get this attachment's relationship to its item.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function post() {
		return $this->belongsTo('App\Models\Topics\Post', 'id');
	}
}