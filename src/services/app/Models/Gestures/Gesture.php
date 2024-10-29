<?php
/******************************************************************************\
|                                                                              |
|                                Gesture.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an instance of gesture (poke etc).            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Gestures;

use Illuminate\Support\Collection;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;

class Gesture extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'gestures';

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
		'kind',
		'sender_id',
		'recipient_id'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'kind',
		'sender',
		'recipient',

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
		'recipient'
	];

	//
	// accessor methods
	//

	/**
	 * Get this instant messages's sender attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getSenderAttribute(): User {
		return $this->sender()->first();
	}

	/**
	 * Get this instant messages's recipient attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getRecipientAttribute(): User {
		return $this->recipient()->first();
	}

	//
	// relationship methods
	//

	/**
	 * Get this instant message's relationship to its sender.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function sender() {
		return $this->belongsTo('App\Models\Users\User', 'sender_id');
	}

	/**
	 * Get this instant message's relationship to its recipient.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function recipient() {
		return $this->belongsTo('App\Models\Users\User', 'recipient_id');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this instant message to return only items sent by a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeSentBy($query, string $senderId) {
		return $query->where('sender_id', '=', $senderId);
	}

	/**
	 * Allow queries for this instant message to return only items sent to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeSentTo($query, string $recipientId) {
		return $query->where('recipient_id', '=', $recipientId);
	}

	//
	// deleting methods
	//

	/**
	 * Delete this instant message and its related items.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete attachments
		//
		// $this->attachments()->delete();

		// delete self
		//
		return self::where('id', '=', $this->id)->delete();
	}
}
