<?php
/******************************************************************************\
|                                                                              |
|                                ChatMessage.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a text messaging chat message.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Chats;

use Illuminate\Support\Collection;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Settings\UserPreference;
use App\Models\Places\CheckIn;
use App\Utilities\Translation\Translation;

class ChatMessage extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'chat_messages';
	
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
		'chat_id',
		'user_id',
		'check_in_id',
		'message',
		'deleted_at'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'chat_id',
		'user',
		'message',
		'language',
		'attachments',
		'check_in',

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
		'language',
		'attachments',
		'check_in'
	];

	//
	// accessor methods
	//

	/**
	 * Get this chat messages's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	/**
	 * Get this chat messages's language attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getLanguageAttribute(): ?string {
		$preference = UserPreference::where('user_id', '=', $this->user_id)
			->where('app', '=', 'chat_browser')
			->where('key', '=', 'language')->first();

		if ($preference) {
			return $preference->value;
		} else {
			return 'English';
		}
	}

	/**
	 * Get this chat message's attachments attribute.
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
			$attributes['chat_attachment_id'] = $attachment->id;
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

	//
	// relationship methods
	//

	/**
	 * Get this chat message's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this chat message's relationship to its chat.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function chat() {
		return $this->belongsTo('App\Models\Chats\Chat');
	}

	/**
	 * Get this chat message's relationship to its attachments.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function attachments() {
		return $this->hasMany('App\Models\Storage\Attachments\ChatAttachment', 'message_id');
	}

	/**
	 * Get this post's relationship to its check-in.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function check_in() {
		return $this->belongsTo('App\Models\Places\CheckIn');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this chat message to return only items associated with a particular chat.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeAssociatedWith($query, string $chatId) {
		return $query->where('chat_id', '=', $chatId);
	}

	/**
	 * Allow queries for this chat message to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, string $userId) {
		return $query->where('user_id', '=', $userId);
	}

	//
	// deleting methods
	//

	/**
	 * Delete this chat message and its related items.
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
	public static function getLanguages(Collection $chatMessages): array {
		$languages = [];
		for ($i = 0; $i < count($chatMessages); $i++) {
			$language = $chatMessages[$i]->language;
			if (!in_array($language, $languages)) {
				array_push($languages, $language);
			}
		}
		return $languages;
	}

	/**
	 * Translate a set of chat messages.
	 *
	 * @param $messages - The messages to translate.
	 * @param $language - The language to translate to.
	 */
	public static function translateAll(Collection $chatMessages, string $toLanguage): Collection {
		$languages = self::getLanguages($chatMessages);
		for ($i = 0; $i < count($languages); $i++) {

			// find chat messages in each language
			//
			$fromLanguage = $languages[$i];
			$collection = $chatMessages->filter(function ($value, $key) use ($fromLanguage) {
				return $value->language == $fromLanguage;
			});

			// translate messages to language
			//
			$messages = $collection->pluck('message')->all();
			$messages = Translation::translate($messages, $fromLanguage, $toLanguage);

			// assign translated messages to chat messages
			//
			$count = 0;
			foreach ($collection as $chatMessage) {
				$chatMessage->message = $messages[$count++];
			}
		}
		return $chatMessages;
	}
}
