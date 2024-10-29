<?php
/******************************************************************************\
|                                                                              |
|                             ShareRequestInfo.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of request to share a file or directory.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage\Sharing\Info;

use DateTime;
use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Storage\Sharing\Share;
use App\Models\Users\Info\UserInfo;

class ShareRequestInfo extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'share_requests';

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

		// user attributes
		//
		'user_id',
		'connection_id',

		// target attributes
		//
		'message',
		'path',
		'copy',

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
		'status',

		// user attributes
		//
		'user',
		'connection',

		// target attributes
		//
		'message',
		'path',
		'copy',

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
		'status',
		'user',
		'connection'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'copy' => 'boolean'
	];

	//
	// accessor methods
	//

	/**
	 * Get this share request's status attribute.
	 *
	 * @return string
	 */
	public function getStatusAttribute(): string {
		return $this->status();
	}
	
	/**
	 * Get this share request's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): UserInfo {
		$connection = UserInfo::find($this->user_id);
		$connection->accepted_at = $this->accepted_at;
		return $connection;
	}

	/**
	 * Get this share request's connection attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getConnectionAttribute(): UserInfo {
		$connection = UserInfo::find($this->connection_id);
		$connection->accepted_at = $this->accepted_at;
		return $connection;
	}

	//
	// relationship methods
	//

	/**
	 * Get this share request's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this share request's relationship to its connection.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function connection() {
		return $this->belongsTo('App\Models\Users\Connections\Connection');
	}

	//
	// querying methods
	//

	/**
	 * Find whether this share request has shares.
	 *
	 * @return bool
	 */
	public function hasShare(): bool {
		return Share::where('owner_id', '=', $this->user_id)
			->where('owner_path', '=',  $this->path)->exists();
	}

	/**
	 * Get this share request's status.
	 *
	 * @return string
	 */
	public function status(): string {
		if ($this->accepted_at) {
			return $this->hasShare()? 'accepted' : 'deleted';
		} else if ($this->declined_at) {
			return 'declined';
		} else {
			return 'pending';
		}
	}
}
