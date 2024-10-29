<?php
/******************************************************************************\
|                                                                              |
|                                   Chat.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a text messaging chat session.                |
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

use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\Connections\Connection;
use App\Models\Chats\Sharing\ChatInvitation;
use App\Models\Chats\ChatMembership;

class Chat extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'chats';

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
		'user_id',
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'user_id',
		'members',
		'num_invitations',
		'num_messages',

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
		'members',
		'num_invitations',
		'num_messages',
	];

	//
	// accessor methods
	//

	/**
	 * Get this chat's members attribute.
	 *
	 * @return App\Models\Users\Connections\Connection[]
	 */
	public function getMembersAttribute(): array {
		return $this->memberships()->get()->pluck('member')->toArray();
	}

	/**
	 * Get this chat's num_invitations attribute.
	 *
	 * @return int
	 */
	public function getNumInvitationsAttribute(): int {
		// return count($this->invitations()->get()->toArray());
		return ChatInvitation::where('chat_id', '=', $this->id)->count();
	}

	/**
	 * Get this chat's num_messages attribute.
	 *
	 * @return int
	 */
	public function getNumMessagesAttribute(): int {
		return ChatMessage::where('chat_id', '=', $this->id)->count();
	}

	//
	// relationship methods
	//

	/**
	 * Get this chat's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this chat's relationship to its messages.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function messages() {
		return $this->hasMany('App\Models\Chats\ChatMessage');
	}

	/**
	 * Get this chat's relationship to its invitations.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function invitations() {
		return $this->hasMany('App\Models\Chats\Sharing\ChatInvitation');
	}

	/**
	 * Get this chat's relationship to its memberships.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function memberships() {
		return $this->hasMany('App\Models\Chats\ChatMembership');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this chat to return only items belonging to a particular user.
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
	 * Delete this chat and its related items.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete messages
		//
		$this->messages()->delete();

		// delete invitations
		//
		$this->invitations()->delete();

		// delete memberships
		//
		$this->memberships()->delete();

		// delete self
		//
		return self::where('id', '=', $this->id)->delete();
	}
}
