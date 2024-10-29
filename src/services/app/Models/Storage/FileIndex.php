<?php
/******************************************************************************\
|                                                                              |
|                                 FileIndex.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a storage system link.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage;

use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Storage\File;
use App\Utilities\Storage\FileStorage;

class FileIndex extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'files';

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

		// link attributes
		//
		'id',
		'user_id',
		'path',
		'text',
		'score',

		// timestamps
		//
		'accessed_at',
		'created_at',
		'updated_at'
	];

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// link attributes
		//
		'id',
		'user',
		'path',
		'size',
		'score',

		// timestamps
		//
		'accessed_at',
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
		'size'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'score' => 'integer'
	];

	//
	// accessor methods
	//

	/**
	 * Get this file index's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	/**
	 * Get this file index's size attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getSizeAttribute(): ?int {

		// get size from local storage
		//
		return filesize($this->rootPath());
	}

	//
	// relationship methods
	//

	/**
	 * Get this link's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		 return $this->belongsTo('App\Models\Users\User');
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
	public function scopeBelongingTo($query, string $userId) {
		return $query->where('user_id', '=', $userId);
	}

	//
	// querying methods
	//

	/**
	 * Convert file index to file.
	 *
	 * @return App\Models\Storage\File
	 */
	public function rootPath() {
		return FileStorage::root() . '/' . $this->homePath();
	}

	/**
	 * Convert file index to file.
	 *
	 * @return App\Models\Storage\File
	 */
	public function homePath() {
		if (!str_starts_with($this->path, '/')) {
			$userAccount = UserAccount::find($this->user_id);
			return ($userAccount->isAdmin()? '' : $userAccount->username) . '/' . $this->path;
		} else {
			return $this->path;
		}
	}

	//
	// conversion methods
	//

	/**
	 * Convert file index to file.
	 *
	 * @return App\Models\Storage\File
	 */
	public function toFile() {		
		return new File([
			'index_id' => $this->id,
			'path' => $this->path,
		]);
	}
}