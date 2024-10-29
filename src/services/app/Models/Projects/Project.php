<?php
/******************************************************************************\
|                                                                              |
|                                  Project.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a task tracking project.                      |
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

use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\UserOwned;
use App\Utilities\Uuids\Guid;

class Project extends TimeStamped
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
	protected $table = 'projects';
	
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
		'description',
		'keywords',
		'public',
		'private',
		'required',
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
		'description',
		'keywords',
		'public',
		'private',
		'required',
		'user',
		'num_members',
		'num_tasks',

		// timestamps
		//
		'accepted_at',
		'created_at',
		'updated_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [
		'user',
		'num_members',
		'num_tasks'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'public' => 'boolean',
		'private' => 'boolean',
		'required' => 'boolean',
		'num_members' => 'integer',
	];

	//
	// accessor methods
	//

	/**
	 * Get this post's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	/**
	 * Get the number of users associated with this project.
	 *
	 * @return int
	 */
	public function getNumMembersAttribute(): int {
		return UserProject::where('project_id', '=', $this->id)->count();
	}

	/**
	 * Get the number of tasks associated with this project.
	 *
	 * @return int
	 */
	public function getNumTasksAttribute(): int {
		return Task::where('project_id', '=', $this->id)->count();
	}

	//
	// relationship methods
	//

	/**
	 * Get this post's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this item's relationship to its tasks.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function task() {
		return $this->hasMany('App\Models\Projects\Task', 'project_id');
	}

	//
	// methods
	//

	/**
	 * Add user to this project.
	 *
	 * @return App\Models\Topics\UserProject
	 */
	public function addUser(string $userId) {

		// create new user project
		//
		$userProject = new UserProject([
			'id' => Guid::create(),
			'user_id' => $userId,
			'project_id' => $this->id
		]);
		$userProject->save();

		return $userProject;
	}
}