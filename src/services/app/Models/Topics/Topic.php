<?php
/******************************************************************************\
|                                                                              |
|                                   Topic.php                                  |
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

namespace App\Models\Topics;

use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\UserOwned;
use App\Models\Topics\UserTopic;
use App\Utilities\Uuids\Guid;

class Topic extends TimeStamped
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
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',
		'name',
		'icon_path',
		'description',
		'keywords',
		'public',
		'private',
		'required',
		'user_id'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'name',
		'icon_path',
		'description',
		'keywords',
		'public',
		'private',
		'required',
		'user',
		'subscribed',
		'num_members',
		'num_posts',

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
		'subscribed',
		'num_members',
		'num_posts'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'public' => 'boolean',
		'private' => 'boolean',
		'required' => 'boolean',
		'subscribed' => 'boolean',
		'num_members' => 'integer',
		'num_posts' => 'integer',
	];

	//
	// accessor methods
	//

	/**
	 * Get this post's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	/**
	 * Get if current user is subscribed to this topic
	 *
	 * @return int
	 */
	public function getSubscribedAttribute(): bool {
		return $this->isOwnedBy(Session::get('user_id')) || UserTopic::where('topic_id', '=', $this->id)
		->where('user_id', '=', Session::get('user_id'))->exists();
	}

	/**
	 * Get the number of users associated with this topic
	 *
	 * @return int
	 */
	public function getNumMembersAttribute(): int {
		return UserTopic::where('topic_id', '=', $this->id)->count();
	}

	/**
	 * Get the number of posts associated with this topic
	 *
	 * @return int
	 */
	public function getNumPostsAttribute(): int {
		return Post::where('topic_id', '=', $this->id)->count();
	}

	//
	// relationship methods
	//

	/**
	 * Get this post's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this item's relationship to its posts.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function post() {
		return $this->hasMany('App\Models\Topics\Post', 'post_id');
	}

	//
	// methods
	//

	/**
	 * Add user to this topic.
	 *
	 * @return App\Models\Topics\UserTopic
	 */
	public function addUser(string $userId) {

		// create new user topic
		//
		$userTopic = new UserTopic([
			'id' => Guid::create(),
			'user_id' => $userId,
			'topic_id' => $this->id
		]);
		$userTopic->save();

		return $userTopic;
	}
}