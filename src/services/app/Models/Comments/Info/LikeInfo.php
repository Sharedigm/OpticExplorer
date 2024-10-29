<?php
/******************************************************************************\
|                                                                              |
|                                 LikeInfo.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a simplified model of a like of an item.                 |
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

use DateTime;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Topics\Info\PostInfo;
use App\Models\Users\Info\UserInfo;

class LikeInfo extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'likes';

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
		'item',
		'item_kind',

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
		'user',
		'item',
		'item_kind'
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
	 * Get this like's item attribute.
	 *
	 * @return App\Models\Topics\Post | App\Models\Comments\Comment | App\Models\Comments\Reply
	 */
	public function getItemAttribute(): ?PostInfo {
		switch ($this->item_type) {
			case 'App\Models\Topics\Post':
				return PostInfo::find($this->item_id);
			case 'App\Models\Comments\Comment':
				return CommentInfo::find($this->item_id);
			case 'App\Models\Comments\Reply':
				return ReplyInfo::find($this->item_id);
			default:
				return null;
		}	
	}

	/**
	 * Get this like's item's kind attribute.
	 *
	 * @return string
	 */
	public function getItemKindAttribute(): ?string {
		switch ($this->item_type) {
			case 'App\Models\Topics\Post':
				return 'post';
			case 'App\Models\Comments\Comment':
				return 'comment';
			case 'App\Models\Comments\Reply':
				return 'reply';
			default:
				return null;
		}	
	}
}
