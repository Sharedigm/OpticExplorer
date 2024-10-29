<?php
/******************************************************************************\
|                                                                              |
|                               ShareRequest.php                               |
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

namespace App\Models\Storage\Sharing;

use DateTime;
use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Storage\Sharing\Share;
use App\Models\Users\User;
use App\Models\Users\UserOwned;
use App\Models\Users\Connections\Connection;

class ShareRequest extends TimeStamped
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
		'share_id',

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
		'share_id',

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
	public function getUserAttribute(): ?User {
		$user = User::find($this->user_id);

		// get accepted timestamp from share request
		//
		if ($user) {
			$user->accepted_at = $this->accepted_at;
		}

		return $user;
	}

	/**
	 * Get this share request's connection attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getConnectionAttribute(): ?User {
		$user = User::find($this->connection_id);

		// get accepted timestamp from share request
		//
		if ($user) {
			$user->accepted_at = $this->accepted_at;
		}

		return $user;
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
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only accepted items.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeAccepted($query) {
		return $query->whereNotNull('accepted_at')->whereHas('share');
	}

	/**
	 * Allow queries for this item to return only deleted items.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeDeleted($query) {
		return $query->whereNotNull('accepted_at')->whereNotHas('share');
	}

	/**
	 * Allow queries for this item to return only declined items.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeDeclined($query) {
		return $query->whereNotNull('declined_at');
	}

	/**
	 * Allow queries for this item to return only pending items.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopePending($query) {
		return $query->whereNull('accepted_at')->whereNull('declined_at');
	}

	/**
	 * Allow queries for this item to return only items sent by a user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Users\User $user
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeSentBy($query, User $user) {
		return $query->where('user_id', '=', $user->id);
	}

	/**
	 * Allow queries for this item to return only items received by a user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Users\User $user
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeReceivedBy($query, User $user) {
		return $query->where('connection_id', '=', $user->id);
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
	 * Get this share request's share.
	 *
	 * @return App\Models\Storage\Sharing\Share
	 */
	public function getShare(): Share {
		return Share::where('owner_id', '=', $this->user_id)
			->where('owner_path', '=',  $this->path)->first();
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
	
	//
	// updating methods
	//

	/**
	 * Accept this share request.
	 *
	 * @return bool
	 */
	public function accept(): bool {
		$this->accepted_at = new DateTime();
		return $this->save();
	}

	/**
	 * Decline this share request.
	 *
	 * @return bool
	 */
	public function decline(): bool {
		$this->declined_at = new DateTime();
		return $this->save();
	}
}