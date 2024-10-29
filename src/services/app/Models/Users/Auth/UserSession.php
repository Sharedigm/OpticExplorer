<?php
/******************************************************************************\
|                                                                              |
|                                UserSession.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's log in session.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users\Auth;

use Illuminate\Support\Facades\Session;
use App\Models\BaseModel;
use App\Models\Users\User;
use App\Models\Utilities\Configuration;

class UserSession extends BaseModel
{
	//
	// attributes
	//

	/**
	 * Indicates if the model should be timestamped.
	 *
	 * @var bool
	 */
	public $timestamps = false;

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'sessions';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'user_id'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'user_id',
		'ip_address',
		'user_agent',
		'payload',
		'last_activity',
		'config'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'config'
	];

	//
	// accessor methods
	//

	/**
	 * Get this session's config attribute.
	 *
	 * @return App\Models\Users\Config
	 */
	public function getConfigAttribute(): Configuration {
		return new Configuration();
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, $userId) {
		return $query->where('user_id', '=', $userId);
	}
	
	//
	// static querying methods
	//

	public static function exists() {
		return Session::has('user_id');
	}

	public static function current() {

		// retreive user id from current session
		//
		$userId = Session::get('user_id');

		// check if current user still exists
		//
		if (!User::where('id', '=', $userId)->exists()) {
			Session::forget('user_id');
			$userId = null;
		}

		return new self([
			'user_id' => $userId
		]);
	}
}
