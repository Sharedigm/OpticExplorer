<?php
/******************************************************************************\
|                                                                              |
|                                   Task.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a task tracking task.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Projects;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Projects\Project;
use App\Models\Users\User;
use App\Utilities\Uuids\Guid;
use App\Utilities\Strings\StringArrayCaster;

class Task extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'tasks';

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
		'project_id',
		'user_id',
		'kind',
		'title',
		'description',
		'keywords',
		'priority',
		'status',
		'due_date'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [
		'id',
		'project_id',
		'project_name',
		'user',
		'kind',
		'title',
		'description',
		'keywords',
		'priority',
		'status',
		'attachments',
		'due_date',

		// timestamps
		//
		'created_at',
		'updated_at',
		'deleted_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'user',
		'project_name',
		'attachments'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'keywords' => StringArrayCaster::class
	];

	//
	// accessor methods
	//

	/**
	 * Get this task's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	/**
	 * Get this task's project name attribute.
	 *
	 * @return string
	 */
	public function getProjectNameAttribute(): string {
		if ($this->project_id) {
			return $this->project->name;
		} else {
			return '';
		}
	}

	/**
	 * Get this task's attachments attribute.
	 *
	 * @return use Illuminate\Support\Collection
	 */
	public function getAttachmentsAttribute(): Collection {

		// get task's attachments
		//
		$attachments = $this->attachments()->get();

		// cast attachments
		//
		for ($i = 0; $i < count($attachments); $i++) {
			$attachment = $attachments[$i];
			$item = $attachment->toItem();

			// get attributes
			//
			$attributes = $item->toArray();
			$attributes['path'] = $attachment->getItemPath();
			$attributes['task_attachment_id'] = $attachment->id;
			$attachments[$i] = $attributes;
		}

		return $attachments;
	}

	//
	// relationship methods
	//

	/**
	 * Get this task's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this task's relationship to its project.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function project() {
		return $this->belongsTo('App\Models\Projects\Project');
	}

	/**
	 * Get this tasks's relationship to its attachments.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function attachments() {
		return $this->hasMany('App\Models\Storage\Attachments\TaskAttachment', 'task_id');
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items associated with a particular project.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeAssociatedWith($query, string $projectId) {
		return $query->where('project_id', '=', $projectId);
	}

	/**
	 * Allow queries for this item to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, string $userId) {
		return $query->where('user_id', '=', $userId);
	}

	/**
	 * Allow queries for this item to return only items not belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeNotBelongingTo($query, string $userId) {
		return $query->where('user_id', '!=', $userId);
	}

	//
	// querying methods
	//

	/**
	 * Find a client side link to this item.
	 *
	 * @return string
	 */
	public function url() {
		return config('app.client_url') . '#tasks/' . $this->id;
	}

	//
	// deleting methods
	//

	/**
	 * Delete this task and its related items.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// delete attachments
		//
		// $this->attachments()->delete();
		
		// delete comments
		//
		// $this->comments()->delete();

		// delete self
		//
		return self::where('id', '=', $this->id)->delete();
	}
}
