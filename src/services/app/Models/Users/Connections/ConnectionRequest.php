<?php
/******************************************************************************\
|                                                                              |
|                             ConnectionRequest.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's connection request.                  |
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

use DateTime;
use Illuminate\Database\Eloquent\Model;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\Connections\Connection;

class ConnectionRequest extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'connection_requests';

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

		// request attributes
		//
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

		// user attributes
		//
		'user',
		'connection',

		// request attributes
		//
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
		'user',
		'connection',
		'status'
	];

	//
	// accessor methods
	//

	/**
	 * Get this connection request's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		$connection = Connection::find($this->user_id);
		if ($connection) {

			// set connection info
			//
			$connection->connection_request_id = $this->id;
			$connection->accepted_at = $this->accepted_at;
		}
		return $connection;
	}

	/**
	 * Get this connection request's connection attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getConnectionAttribute(): User {
		$connection = $this->connection()->first();
		if ($connection) {

			// set connection info
			//
			$connection->connection_request_id = $this->id;
			$connection->accepted_at = $this->accepted_at;
		}
		return $connection;
	}

	/**
	 * Get this connection request's status attribute.
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
	 * Get this item's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->hasOne('App\Models\Users\User');
	}

	/**
	 * Get this item's relationship to its connection.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function connection() {
		return $this->belongsTo('App\Models\Users\Connections\Connection');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items sent by a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeSentBy($query, string $userId) {
		return $query->where('user_id', '=', $userId);
	}

	/**
	 * Allow queries for this item to return only items received by a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeReceivedBy($query, string $userId) {
		return $query->where('connection_id', '=', $userId);
	}

	//
	// setting methods
	//

	/**
	 * Accept this connection request.
	 *
	 * @return bool
	 */
	public function accept(): bool {
		$this->accepted_at = new DateTime();
		return $this->save();
	}

	/**
	 * Decline this connection request.
	 *
	 * @return bool
	 */
	public function decline(): bool {
		$this->declined_at = new DateTime();
		return $this->save();
	}

	//
	// querying methods
	//

	/**
	 * Get this connection request's status.
	 *
	 * @return string
	 */
	public function status(): string {
		if ($this->accepted_at) {
			return 'accepted';
		} else if ($this->declined_at) {
			return 'declined';
		} else {

			// check reciprocol request
			//
			$reciprocol = $this->reciprocol()->first();
			if ($reciprocol) {
				if ($reciprocol->accepted_at) {
					return 'accepted';
				} else if ($reciprocol->declined_at) {
					return 'declined';
				}
			}

			return 'pending';
		}
	}

	/**
	 * Get connection request by connection sent to user.
	 *
	 * @return App\Models\Users\Connections\Connections\ConnectionRequest
	 */
	public function reciprocol() {
		return self::where('user_id', '=', $this->connection_id)
			->where('connection_id', '=', $this->user_id);
	}
}
