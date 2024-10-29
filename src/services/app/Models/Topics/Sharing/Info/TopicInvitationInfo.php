<?php
/******************************************************************************\
|                                                                              |
|                            TopicInvitationInfo.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a simplified invitation to join a post topic.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Topics\Sharing\Info;

use DateTime;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\Info\UserInfo;
use App\Models\Topics\Info\TopicInfo;

class TopicInvitationInfo extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'topic_invitations';

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
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// attributes
		//
		'id',
		'topic',

		// invitation attributes
		//
		'sender',
		'recipient',
		'message',
		'status',

		// timestamps
		//
		'created_at',
		'updated_at',
		'accepted_at',
		'declined_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'topic',
		'sender',
		'recipient',
		'status'
	];

	//
	// accessor methods
	//
	
	/**
	 * Get this topic invitation's topic.
	 *
	 * @return App\Models\Topics\Topic
	 */
	public function getTopicAttribute(): TopicInfo {
		return $this->topic()->first();
	}

	/**
	 * Get this topic invitation's sender attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getSenderAttribute(): UserInfo {
		return $this->sender()->first();
	}

	/**
	 * Get this topic invitation's recipient attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getRecipientAttribute(): UserInfo {
		return $this->recipient()->first();
	}

	/**
	 * Get this topic invitation's status attribute.
	 *
	 * @return string
	 */
	public function getStatusAttribute(): string {
		return $this->status();
	}

	//
	// relationship methods
	//

	/**
	 * Get this topic invitation's relationship to its topic.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function topic() {
		return $this->belongsTo('App\Models\Topics\Info\TopicInfo', 'topic_id');
	}
	
	/**
	 * Get this topic invitation's relationship to its sender.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function sender() {
		return $this->belongsTo('App\Models\Users\Info\UserInfo', 'sender_id');
	}

	/**
	 * Get this topic invitation's relationship to its recipient.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function recipient() {
		return $this->belongsTo('App\Models\Users\Info\UserInfo', 'recipient_id');
	}

	/**
	 * Get this topic invitation's status.
	 *
	 * @return string
	 */
	public function status(): string {
		if ($this->accepted_at) {
			return $this->topic()? 'accepted' : 'deleted';
		} else if ($this->declined_at) {
			return 'declined';
		} else {
			return 'pending';
		}
	}
}
