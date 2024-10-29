<?php
/******************************************************************************\
|                                                                              |
|                                   Group.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a group of connections.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Connections;

use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\UserOwned;
use App\Models\Users\User;
use App\Models\Users\Connections\GroupMember;

class Group extends TimeStamped
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
	protected $table = 'groups';

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
		'members',

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
		'members'
	];

	//
	// accessor methods
	//

	/**
	 * Get this group's members attribute.
	 *
	 * @return App\Models\Users\User[]
	 */
	public function getMembersAttribute(): array {
		return GroupMember::where('group_id', '=', $this->id)->get()->pluck('user')->toArray();
	}
}