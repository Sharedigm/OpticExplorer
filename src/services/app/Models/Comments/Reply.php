<?php
/******************************************************************************\
|                                                                              |
|                                  Reply.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a reply to a comment or to another reply.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Comments;

use Illuminate\Support\Collection;
use App\Models\Comments\Comment;
use Illuminate\Notifications\DatabaseNotification;

class Reply extends Comment
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
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',
		'item_id',
		'item_type',
		'user_id',
		'message'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'item_id',
		'item_type',
		'user',
		'message',
		'attachments',
		'num_likes',
		'likes',
		'replies',

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
		'attachments',
		'num_likes',
		'likes',
		'replies'
	];

	//
	// accessor methods
	//

	/**
	 * Get this reply's replies attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getRepliesAttribute(): Collection {
		return $this->replies()
			->orderBy('created_at', 'ASC')
			->get();
	}

	/**
	 * Get this reply's attachments attribute.
	 *
	 * @return use Illuminate\Support\Collection
	 */
	public function getAttachmentsAttribute(): Collection {

		// get reply's attachments
		//
		$attachments = $this->attachments()->get();

		// cast attachments
		//
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			$item = $attachment->toItem();

			// get attributes
			//
			$attributes = $item->toArray();
			$attributes['path'] = $attachment->getItemPath();
			$attributes['reply_attachment_id'] = $attachment->id;
			$attachments[$i] = $attributes;
		}

		return $attachments;
	}

	//
	// relationship methods
	//

	/**
	 * Get this reply's relationship to its item.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function item() {
		/*
		switch ($this->item_type) {
			case 'App\Models\Comments\Comment':
				return $this->comment();
			case 'App\Models\Comments\Reply':
				return $this->reply();
		}
		*/
		return $this->morphTo();
	}

	/**
	 * Get this reply's relationship to its parent comment.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function comment() {
		return $this->belongsTo('App\Models\Comments\Comment', 'item_id');
	}

	/**
	 * Get this reply's relationship to its parent reply.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function reply() {
		return $this->belongsTo('App\Models\Comments\Reply', 'item_id');
	}

	/**
	 * Get this reply's relationship to its replies.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function replies() {
		return $this->hasMany('App\Models\Comments\Reply', 'item_id');
	}

	/**
	 * Get this reply's relationship to its likes.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function likes() {
		return $this->hasMany('App\Models\Comments\Like', 'item_id');
	}

	/**
	 * Get this reply's relationship to its attachments.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function attachments() {
		return $this->hasMany('App\Models\Storage\Attachments\ReplyAttachment', 'reply_id');
	}

	/**
	 * Get this comment's relationship to its notifications.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function notifications() {
		return DatabaseNotification::where('type', '=', 'App\Notifications\ReplyNotification')
			->where('data->reply_id', '=', $this->id);
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items belonging to a particular comment.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Comments\Comment $comment
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeToComment($query, Comment $comment) {
		return $query->where('item_id', '=', $comment->id);
	}

	/**
	 * Allow queries for this item to return only items belonging to a particular reply.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Comments\Reply $reply
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeToReply($query, Reply $reply) {
		return $query->where('item_id', '=', $reply->id);
	}

	//
	// querying methods
	//

	/**
	 * Get this reply's relationship to its item.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function getItemType(): ?string {
		switch ($this->item_type) {
			case 'App\Models\Comments\Comment':
				return 'comment';
			case 'App\Models\Comments\Reply':
				return 'reply';
			default:
				return null;
		}
	}

	//
	// deleting methods
	//

	/**
	 * Delete this reply and its related items.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete attachments
		//
		$this->attachments()->delete();

		// delete replies
		//
		$this->replies()->delete();

		// delete likes
		//
		$this->likes()->delete();

		// delete notifications
		//
		$this->notifications()->delete();

		// delete self
		//
		return self::where('id', '=', $this->id)->delete();
	}
}
