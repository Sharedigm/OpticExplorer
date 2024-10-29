<?php
/******************************************************************************\
|                                                                              |
|                                 Comment.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a comment on a post.                          |
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
use App\Models\Topics\Post;
use Illuminate\Notifications\DatabaseNotification;

class Comment extends Post
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
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',
		'post_id',
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
		'post_id',
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
	 * Get this comment's replies attribute.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getRepliesAttribute(): Collection {
		return $this->replies()
			->orderBy('created_at', 'ASC')
			->get();
	}

	/**
	 * Get this comment's attachments attribute.
	 *
	 * @return use Illuminate\Support\Collection
	 */
	public function getAttachmentsAttribute(): Collection {

		// get comment's attachments
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
			$attributes['comment_attachment_id'] = $attachment->id;
			$attachments[$i] = $attributes;
		}

		return $attachments;
	}

	//
	// relationship methods
	//

	/**
	 * Get this comment's relationship to its post.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function post() {
		return $this->belongsTo('App\Models\Topics\Post');
	}

	/**
	 * Get this comment's relationship to its replies.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function replies() {
		return $this->hasMany('App\Models\Comments\Reply', 'item_id');
	}

	/**
	 * Get this comment's relationship to its likes.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function likes() {
		return $this->hasMany('App\Models\Comments\Like', 'item_id');
	}

	/**
	 * Get this comment's relationship to its attachments.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function attachments() {
		return $this->hasMany('App\Models\Storage\Attachments\CommentAttachment', 'comment_id');
	}

	/**
	 * Get this comment's relationship to its notifications.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function notifications() {
		return DatabaseNotification::where('type', '=', 'App\Notifications\CommentNotification')
			->where('data->comment_id', '=', $this->id);
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only comments on a particular post.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Topics\Post $post
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeOnPost($query, Post $post) {
		return $query->where('post_id', '=', $post->id);
	}

	//
	// deleting methods
	//

	/**
	 * Delete this comment and its related items.
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
