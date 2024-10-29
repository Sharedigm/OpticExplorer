<?php
/******************************************************************************\
|                                                                              |
|                              ChatInvitation.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an invitation to a text chat session.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Chats\Sharing;

use DateTime;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\Connections\Connection;
use App\Models\Chats\Chat;

class ChatInvitation extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'chat_invitations';

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

		// attributes
		//
		'id',
		'chat_id',

		// invitation attributes
		//
		'sender_id',
		'recipient_id',
		'message',
		'status',

		// timestamps
		//
		'accepted_at',
		'declined_at'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// attributes
		//
		'id',
		'chat_id',

		// invitation attributes
		//
		'sender',
		'recipient',
		'message',
		'status',
		'chat',

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
		'sender',
		'recipient',
		'status',
		'chat'
	];

	//
	// accessor methods
	//

	/**
	 * Get this chat invitation's sender attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getSenderAttribute(): ?User {
		return $this->sender()->first();
	}

	/**
	 * Get this chat invitation's recipient attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getRecipientAttribute(): ?User {
		return $this->recipient()->first();
	}

	/**
	 * Get this chat invitation's status attribute.
	 *
	 * @return string
	 */
	public function getStatusAttribute(): string {
		return $this->status();
	}

	/**
	 * Get this chat invitation's chat attribute.
	 *
	 * @return string
	 */
	public function getChatAttribute() {
		return Chat::find($this->chat_id);
	}

	//
	// relationship methods
	//

	/**
	 * Get this chat invitation's relationship to its chat.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function chat() {
		return $this->belongsTo('App\Models\Chats\Chat');
	}

	/**
	 * Get this chat invitation's relationship to its sender.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function sender() {
		return $this->belongsTo('App\Models\Users\User', 'sender_id');
	}

	/**
	 * Get this chat invitation's relationship to its recipient.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function recipient() {
		return $this->belongsTo('App\Models\Users\User', 'recipient_id');
	}

	/**
	 * Get this chat invitation's status.
	 *
	 * @return string
	 */
	public function status(): string {
		if ($this->accepted_at) {
			return 'accepted';
		} else if ($this->declined_at) {
			return 'declined';
		} else {
			return 'pending';
		}
	}

	//
	// updating methods
	//

	/**
	 * Accept this chat invitation.
	 *
	 * @return bool
	 */
	public function accept(): bool {
		$this->accepted_at = new DateTime();
		return $this->save();
	}

	/**
	 * Decline this chat invitation.
	 *
	 * @return bool
	 */
	public function decline(): bool {
		$this->declined_at = new DateTime();
		return $this->save();
	}
}
