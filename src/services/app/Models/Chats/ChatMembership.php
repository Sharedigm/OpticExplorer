<?php
/******************************************************************************\
|                                                                              |
|                              ChatMembership.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a membership in a text messaging chat.        |
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

class ChatMembership extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'chat_memberships';

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
		'invitation_id',
		'member_id',
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'chat_id',
		'member_id',

		// timestamps
		//
		'created_at',
		'updated_at'
	];

	//
	// relationship methods
	//

	/**
	 * Get this chat membership's relationship to its chat.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function chat() {
		return $this->belongsTo('App\Models\Chats\Chat');
	}

	/**
	 * Get this chat membership's relationship to its member.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function member() {
		return $this->hasOne('App\Models\Users\Connections\Connection', 'id', 'member_id');
	}

	/**
	 * Get this chat membership's relationship to its invitation.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function invitation() {
		return $this->hasOne('App\Models\Chats\Sharing\ChatInvitation', 'id', 'invitation_id');
	}

	//
	// deleting methods
	//

	/**
	 * Delete this chat membership and its related items.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete invitation, if one exists
		//
		if ($this->invitation()->exists()) {
			$this->invitation()->delete();
			/*
			$invitation = $this->invitation();
			$this->change([
				'invitation_id' => null
			]);
			$invitation()->delete();
			*/
		}

		// delete self
		//
		return self::where('id', '=', $this->id)->delete();
	}
}
