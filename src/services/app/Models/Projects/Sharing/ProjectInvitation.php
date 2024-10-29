<?php
/******************************************************************************\
|                                                                              |
|                            ProjectInvitation.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an invitation to join a task project.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Projects\Sharing;

use DateTime;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\Connections\Connection;
use App\Models\Projects\Project;

class ProjectInvitation extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'project_invitations';

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
		'project_id',

		// invitation attributes
		//
		'sender_id',
		'recipient_id',
		'message',

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
		'project',

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
		'project',
		'sender',
		'recipient',
		'status'
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
	 * Get this project invitation's project.
	 *
	 * @return App\Models\Projects\Project
	 */
	public function getProjectAttribute(): Project {
		return $this->project()->first();
	}

	/**
	 * Get this project invitation's sender attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getSenderAttribute(): User {
		return $this->sender()->first();
	}

	/**
	 * Get this project invitation's recipient attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getRecipientAttribute(): User {
		return $this->recipient()->first();
	}

	/**
	 * Get this project invitation's status attribute.
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
	 * Get this project invitation's relationship to its project.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function project() {
		return $this->belongsTo('App\Models\Projects\Project');
	}

	/**
	 * Get this project invitation's relationship to its sender.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function sender() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this project invitation's relationship to its recipient.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function recipient() {
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

	/**
	 * Get this share request's status.
	 *
	 * @return string
	 */
	public function status(): string {
		if ($this->accepted_at) {
			return $this->project()? 'accepted' : 'deleted';
		} else if ($this->declined_at) {
			return 'declined';
		} else {
			return 'pending';
		}
	}
	
	//
	// setting methods
	//

	/**
	 * Accept this project invitation.
	 *
	 * @return bool
	 */
	public function accept(): bool {

		// add recipient user to project
		//
		$project = $this->project()->first();
		$project->addUser($this->recipient_id);

		// update project invitation
		//
		$this->accepted_at = new DateTime();
		return $this->save();
	}

	/**
	 * Decline this project invitation.
	 *
	 * @return bool
	 */
	public function decline(): bool {

		// update project invitation
		//
		$this->declined_at = new DateTime();
		return $this->save();
	}
}
