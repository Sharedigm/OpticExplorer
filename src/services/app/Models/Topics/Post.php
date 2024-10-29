<?php
/******************************************************************************\
|                                                                              |
|                                   Post.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a post.                                       |
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

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Topics\Topic;
use App\Models\Comments\Like;
use App\Models\Settings\UserPreference;
use App\Models\Places\CheckIn;
use App\Utilities\Translation\Translation;
use App\Utilities\Uuids\Guid;

class Post extends TimeStamped
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
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'id',
		'topic_id',
		'user_id',
		'check_in_id',
		'message',
		'public',
		'deleted_at'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'topic_id',
		'topic_name',
		'user',
		'check_in',
		'message',
		'public',
		'language',
		'attachments',
		'num_likes',
		'num_comments',
		'likes',
		'comments',

		// timestamps
		//
		'created_at',
		'updated_at',
		'deleted_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'user',
		'topic_name',
		'language',
		'attachments',
		'check_in',
		'num_likes',
		'num_comments',
		'likes',
		'comments'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'public' => 'boolean'
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
	 * Get this post's language attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getLanguageAttribute(): ?string {
		$preference = UserPreference::where('user_id', '=', $this->user_id)
			->where('app', '=', 'news_browser')
			->where('key', '=', 'language')->first();

		if ($preference) {
			return $preference->value;
		} else {
			return 'English';
		}
	}

	/**
	 * Get this post's topic name attribute.
	 *
	 * @return string
	 */
	public function getTopicNameAttribute(): ?string {
		if ($this->topic_id) {
			return $this->topic->name;
		} else {
			return null;
		}
	}

	/**
	 * Get this post's attachments attribute.
	 *
	 * @return use Illuminate\Support\Collection
	 */
	public function getAttachmentsAttribute(): Collection {

		// get post's attachments
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
			$attributes['post_attachment_id'] = $attachment->id;
			$attachments[$i] = $attributes;
		}

		return $attachments;
	}

	/**
	 * Get this post's check-in attribute.
	 *
	 * @return App\Models\Places\CheckIn
	 */
	public function getCheckInAttribute(): ?CheckIn {
		return $this->check_in()->first();
	}

	/**
	 * Get this post's num likes attribute.
	 *
	 * @return int
	 */
	public function getNumLikesAttribute(): int {
		return $this->likes()->count();
	}

	/**
	 * Get this post's num comments attribute.
	 *
	 * @return int
	 */
	public function getNumCommentsAttribute(): int {
		return $this->comments()->count();
	}

	/**
	 * Get this post's liked by current user attribute.
	 *
	 * @return bool
	 */
	public function getLikedByCurrentUserAttribute(): bool {
		return $this->isLikedBy(Session::get('user_id'));
	}

	/**
	 * Get this post's likes attribute.
	 *
	 * @return string[]
	 */
	public function getLikesAttribute(): array {
		if ($this->isLikedBy(Session::get('user_id'))) {
			$likes = $this->likes()->where('user_id', '!=', Session::get('user_id'))
				->orderBy('created_at', 'DESC')
				->limit(4)
				->get();
			$users = $likes->pluck('user');
			$names = $users->pluck('short_name');
			return array_merge(['you'], $names->toArray());
		} else {
			$likes = $this->likes()
				->orderBy('created_at', 'DESC')
				->limit(5)
				->get();
			$users = $likes->pluck('user');
			$names = $users->pluck('short_name');
			return $names->toArray();
		}
	}

	/**
	 * Get this post's comments attribute.
	 *
	 * @return App\Models\Comments\Comment[]
	 */
	public function getCommentsAttribute() {
		return $this->comments()
			->orderBy('created_at', 'ASC')
			->get();
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
	 * Get this post's relationship to its topic.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function topic() {
		return $this->belongsTo('App\Models\Topics\Topic');
	}

	/**
	 * Get this post's relationship to its attachments.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function attachments() {
		return $this->hasMany('App\Models\Storage\Attachments\PostAttachment', 'post_id');
	}

	/**
	 * Get this post's relationship to its check-in.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function check_in() {
		return $this->belongsTo('App\Models\Places\CheckIn');
	}

	/**
	 * Get this post's relationship to its comments.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function comments() {
		return $this->hasMany('App\Models\Comments\Comment');
	}

	/**
	 * Get this post's relationship to its likes.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function likes() {
		return $this->hasMany('App\Models\Comments\Like', 'item_id');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items associated with a particular topic.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeAssociatedWith($query, string $topicId) {
		return $query->where('topic_id', '=', $topicId);
	}

	/**
	 * Allow queries for this item to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, string $userId) {
		return $query->where('user_id', '=', $userId);
	}

	/**
	 * Allow queries for this item to return only items not belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeNotBelongingTo($query, string $userId) {
		return $query->where('user_id', '!=', $userId);
	}

	//
	// querying methods
	//
	
	/**
	 * Get whether this post is liked by a user.
	 *
	 * @return bool
	 */
	public function isLikedBy($userId): bool {

		// apply filter and check if exists
		//
		return $this->likes()
			->belongingTo($userId)
			->exists();
	}

	/**
	 * Find a client side link to this item.
	 *
	 * @return string
	 */
	public function url() {
		return config('app.client_url') . '#posts/' . $this->id;
	}

	//
	// setting methods
	//

	/**
	 * Mark this post as liked by a user.
	 *
	 * @param string $userId
	 * @return App\Models\Topics\Like
	 */
	public function likeBy(string $userId) {
		
		// create new like
		//
		if (!$this->isLikedBy($userId)) {
			$like = new Like([
				'id' => Guid::create(),
				'item_id' => $this->id,
				'item_type' => $this->getFullClassName(),
				'user_id' => $userId
			]);
			$like->save();
			return $like;
		}
	}

	//
	// deleting methods
	//

	/**
	 * Delete this post and its related items.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete attachments
		//
		$this->attachments()->delete();

		// delete check-in
		//
		$this->check_in()->delete();
		
		// delete comments
		//
		$this->comments()->delete();

		// delete comments
		//
		$this->likes()->delete();

		// delete self
		//
		return self::where('id', '=', $this->id)->delete();
	}

	//
	// static translation methods
	//

	/**
	 * Translate a set of chat messages.
	 *
	 * @param $chatMessages - The chat messages to translate.
	 * @return string[]
	 */
	public static function getLanguages(Collection $posts): array {
		$languages = [];
		for ($i = 0; $i < count($posts); $i++) {
			$language = $posts[$i]->language;
			if (!in_array($language, $languages)) {
				array_push($languages, $language);
			}
		}
		return $languages;
	}

	/**
	 * Translate a set of posts.
	 *
	 * @param $posts - The posts to translate.
	 * @param $language - The language to translate to.
	 */
	public static function translateAll(Collection $posts, string $toLanguage): Collection {
		$languages = self::getLanguages($posts);
		for ($i = 0; $i < count($languages); $i++) {

			// find posts in each language
			//
			$fromLanguage = $languages[$i];
			$collection = $posts->filter(function ($value, $key) use ($fromLanguage) {
				return $value->language == $fromLanguage;
			});

			// translate posts to language
			//
			$messages = $collection->pluck('message')->all();
			$messages = Translation::translate($messages, $fromLanguage, $toLanguage);

			// assign translated messages to chat messages
			//
			$count = 0;
			foreach ($collection as $post) {
				$post->message = $messages[$count++];
			}
		}
		return $posts;
	}
}
