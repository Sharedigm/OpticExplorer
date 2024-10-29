<?php
/******************************************************************************\
|                                                                              |
|                                ReplyInfo.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a simplified model of a reply to a comment or to         |
|        another reply.                                                        |
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
use App\Models\Comments\Comment;
use App\Models\Comments\Reply;
use App\Models\Comments\Info\CommentInfo;
use App\Models\Users\Info\UserInfo;

class ReplyInfo extends CommentInfo
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'replies';
	
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
		'item_id',
		'item_type',
		'post_id',
		'user',
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
		'user',
		'post_id'
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
	 * Get this reply's post id attribute.
	 *
	 * @return string
	 */
	public function getPostIdAttribute(): ?string {
		switch ($this->item_type) {
			case 'App\Models\Comments\Comment':
				$comment = Comment::find($this->item_id);
				if ($comment) {
					return $comment->post_id;	
				}			
				/*
				$commentInfo = CommentInfo::find($this->item_id);
				if ($commentInfo) {
					return $commentInfo->post_id;	
				}
				*/
				break;
			case 'App\Models\Comments\Reply':
				$reply = Reply::find($this->item_id);
				if ($reply) {
					return $reply->post_id;	
				}	
				/*
				$replyInfo = ReplyInfo::find($this->item_id);
				if ($replyInfo) {
					return $replyInfo->post_id;
				}
				*/
				break;
			default:
				return null;
		}
	}
}
