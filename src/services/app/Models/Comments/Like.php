<?php
/******************************************************************************\
|                                                                              |
|                                   Like.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract base model of a like of an item.             |
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

use App\Models\TimeStamps\TimeStamped;
use App\Models\Topics\Post;
use App\Models\Users\User;
use Illuminate\Notifications\DatabaseNotification;

class Like extends TimeStamped
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
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',

		// item attributes
		//
		'item_id',
		'item_type',

		// user attributes
		//
		'user_id'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',

		// item attributes
		//
		'item',
		'item_kind',

		// user attributes
		//
		'user',

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

		// item attributes
		//
		'item',
		'item_kind',

		// user attributes
		//
		'user'
	];

	//
	// accessor methods
	//

	/**
	 * Get this like's item attribute.
	 *
	 * @return App\Models\Topics\Post | App\Models\Comments\Comment | App\Models\Comments\Reply
	 */
	public function getItemAttribute(): ?Post {
		return $this->item()->first();
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

	/**
	 * Get this like's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	//
	// relationship methods
	//

	/**
	 * Get this like's relationship to its item.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function item() {
		return $this->morphTo();
	}
	
	/**
	 * Get this like's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User', 'user_id');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, ?string $userId) {
		return $query->where('user_id', '=', $userId);
	}

	//
	// deleting methods
	//

	/**
	 * Delete this like and its related items.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete notifications
		//
		DatabaseNotification::where('type', '=', 'App\Notifications\LikeNotification')
			->where('data->like_id', '=', $this->id)
			->delete();

		// delete self
		//
		return self::where('id', '=', $this->id)->delete();
	}
}
