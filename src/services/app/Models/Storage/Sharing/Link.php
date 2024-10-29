<?php
/******************************************************************************\
|                                                                              |
|                                    Link.php                                  |
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

namespace App\Models\Storage\Sharing;

use DateTime;
use Illuminate\Support\Facades\Session;
use App\Models\TimeStamps\TimeStamped;
use App\Models\Users\User;
use App\Models\Users\Accounts\UserAccount;
use App\Models\Storage\Item;
use App\Models\Storage\File;
use App\Models\Storage\Directory;
use App\Models\Storage\Traits\ItemCreatable;
use App\Utilities\Strings\StringUtils;

class Link extends TimeStamped
{
	//
	// attributes
	//
	
	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'links';

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
		'editable',
		'message',

		// link restriction attributes
		//
		'hits',
		'limit',
		'expiration_date',
		'password',

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
		'target',
		'editable',
		'message',

		// link restriction attributes
		//
		'hits',
		'limit',
		'expiration_date',
		'password',

		// appended attributes
		//
		'restricted',
		'expired',
		'protected',
		'authenticated',

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
		'target',

		// user account attrributes
		//
		'restricted',
		'expired',
		'protected'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'editable' => 'boolean',
		'hits' => 'integer',
		'limit' => 'integer',
		'restricted' => 'boolean',
		'expired' => 'boolean',
		'protected' => 'boolean',
		'authenticated' => 'boolean'
	];

	//
	// accessor methods
	//

	/**
	 * Get this link's user attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getUserAttribute(): User {
		return $this->user()->first();
	}

	/**
	 * Get this link's target attribute.
	 *
	 * @return App\Models\Storage\Item
	 */
	public function getTargetAttribute(): array {

		// set file system root
		//
		$root = config('filesystems.disks.local.root');
		$userAccount = UserAccount::where('user_id', '=', $this->user_id)->first();
		config(['filesystems.disks.local.root' => $root . '/' . $userAccount->username]);

		/*
		if ($this->isFolderLink()) {
			$target = new Directory([
				'path' => $this->path
			]);
		} else {
			$target = new File([
				'path' => $this->path
			]);
		}
		*/
		$target = ItemCreatable::createItem([
			'path' => $this->path
		]);	

		// add file counts to directories
		//
		if ($target instanceof Directory) {
			$target->append('num_files');
		}

		// get target file / directory info
		//
		$target = $target->toArray();

		// set target permissions
		//
		$target['permissions'] = ($this->editable? Item::ALL_WRITE : Item::READ_WRITE);

		// restore file system root
		//
		config(['filesystems.disks.local.root' => $root]);

		return $target;
	}

	/**
	 * Get this link's filename attribute.
	 *
	 * @return string
	 */
	public function getFilenameAttribute(): string {
		if ($this->isFolderLink()) {
			return basename($this->path) . '/';
		} else {
			return basename($this->path);
		}
	}

	/**
	 * Get this link's restricted attribute.
	 *
	 * @return bool
	 */
	public function getRestrictedAttribute(): bool {
		return $this->limit && $this->hits >= $this->limit;
	}

	/**
	 * Get this link's expired attribute.
	 *
	 * @return bool
	 */
	public function getExpiredAttribute(): bool {
		return new DateTime() > new DateTime($this->expiration_date);
	}

	/**
	 * Get this link's protected attribute.
	 *
	 * @return bool
	 */
	public function getProtectedAttribute(): bool {
		return $this->password != null;
	}

	/**
	 * Get this link's hidden attributes.
	 *
	 * @return array
	 */
	public function getHidden(): array {
		if (!$this->user->isCurrent()) {
			return [
				'password'
			];
		} else {
			return [];
		}
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
	 * Find whether or not this link is editable.
	 *
	 * @return bool
	 */
	public function isEditable(): bool {
		return $this->editable;
	}

	/**
	 * Find whether or not this is a link to a file.
	 *
	 * @return bool
	 */
	public function isFileLink(): bool {
		return !StringUtils::endsWith($this->path, '/');
	}

	/**
	 * Find whether or not this is a link to a directory.
	 *
	 * @return bool
	 */
	public function isFolderLink(): bool {
		return StringUtils::endsWith($this->path, '/');
	}

	//
	// visibility methods
	//

	/**
	 * Set visibility of attributes.
	 *
	 * @return void
	 */
	public function setAttributeVisibility() {
		if ($this->user_id == Session::get('user_id')) {
			$this->setVisible(array_merge($this->visible, $this->hidden));
		}
	}

	//
	// conversion methods
	//

	/**
	 * Convert item to JSON.
	 *
	 * @param $options - json conversion options.
	 * @return string
	 */
	public function toJson($options = 0): string {
		$this->setAttributeVisibility();
		return parent::toJson($options);
	}

	/**
	 * Convert item to array.
	 *
	 * @return array
	 */
	public function toArray(): array {
		$this->setAttributeVisibility();
		return parent::toArray();
	}
}
