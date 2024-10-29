<?php
/******************************************************************************\
|                                                                              |
|                                  Share.php                                   |
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

use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;

class Share extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'shares';

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
		'owner_id',

		// path attributes
		//
		'path',
		'owner_path'
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
		'owner',

		// path attributes
		//
		'path',
		'owner_path',

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
		'owner'
	];

	//
	// accessor methods
	//

	/**
	 * Get this share's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	//
	// relationship methods
	//

	/**
	 * Get this share's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	/**
	 * Get this share's relationship to its owner.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function owner() {
		return $this->belongsTo('App\Models\Users\User', 'owner_id');
	}

	//
	// query scope methods
	//

	//
	// static methods
	//

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
	 * Allow queries for this item to return only items owned by a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $ownerId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeOwnedBy($query, string $ownerId) {
		return $query->where('owner_id', '=', $ownerId);
	}

	/**
	 * Allow queries for this item to return only items with file paths.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Users\User $user
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeOfFiles($query) {
		return $query->where('path', 'not like', '%/');
	}

	/**
	 * Allow queries for this item to return only items with directory paths.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param App\Models\Users\User $user
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeOfDirectories($query) {
		return $query->where('path', 'like', '%/');
	}

	/**
	 * Allow queries for this item to return only items contained by a directory path.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $path
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeContainedBy($query, string $path, $recursive = false) {
		if (!$path) {

			// root path
			//
			if ($recursive) {
				$query->where('path', 'like', '%');
			} else {
				$query->where('path', 'like', '%')
					->where('path', 'not like', '_%/%_');			
			}
		} else {

			// subdirectory path
			//
			if ($recursive) {
				$query->where('path', '!=', $path)
					->where('path', 'like', $path . '%');
			} else {
				$query->where('path', '!=', $path)
					->where('path', 'like', $path . '%')
					->where('path', 'not like', $path . '_%/%_');				
			}
		}
	}

	//
	// querying methods
	//

	/**
	 * Get this share's path of an item relative to its owner
	 *
	 * @param string $path
	 * @return string
	 */
	public function ownerPath(string $path): string {
		return str_replace($this->path, $this->owner_path, $path);
	}
}
