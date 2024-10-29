<?php
/******************************************************************************\
|                                                                              |
|                               GestureInfo.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a simplified model of a gesture (poke etc).              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Gestures\Info;

use DateTime;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\Info\UserInfo;

class GestureInfo extends TimeStamped
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
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'kind',
		'sender',

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
		'sender'
	];

	//
	// accessor methods
	//

	/**
	 * Get this gesture's sender attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getSenderAttribute(): UserInfo {
		return UserInfo::find($this->sender_id);
	}
}
