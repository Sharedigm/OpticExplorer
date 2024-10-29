<?php
/******************************************************************************\
|                                                                              |
|                                Protectable.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of a shareable storage system item.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage\Traits;

use Illuminate\Support\Facades\Session;
use App\Utilities\Storage\Permissions;

trait Protectable
{
	//
	// constants
	//

	public const READ_ONLY = '444';
	public const READ_WRITE = '755';
	public const ALL_WRITE = '777';

	//
	// access control accessor methods
	//

	/**
	 * Get this item's permissions attribute (in octal).
	 *
	 * @return string
	 */
	public function getPermissionsAttribute(): string {

		// check if item has a link context
		//
		if ($this->hasLink()) {
			return $this->getLink()->isEditable()? self::READ_WRITE : self::READ_ONLY;

		// check is item is dereferenced from root
		//
		} else if ($this->isAbsolute()) {
			return self::READ_ONLY;

		// check which file system to use
		//
		} else if ($this->isLocal()) {

			// check if file exists
			//
			if (!$this->exists()) {
				return self::READ_WRITE;
			}

			// get permissions from local storage
			//
			return substr(sprintf('%o', fileperms($this->rootPath())), -3);
		} else {

			// allow writing for non-local storage
			//
			return self::READ_WRITE;
		}
	}

	//
	// permission querying methods
	//

	/**
	 * Find if this item is readable by a group.
	 *
	 * @param string $group - the group to return permissions of.
	 * @return bool
	 */
	public function isReadableBy(string $group): bool {
		return Permissions::isReadable($this->permissions, $group);
	}

	/**
	 * Find if this item is writable by a group.
	 *
	 * @param string $group - the group to return permissions of.
	 * @return bool
	 */
	public function isWritableBy(string $group): bool {
		return Permissions::isWritable($this->permissions, $group);
	}

	/**
	 * Find if this item is executable by a group.
	 *
	 * @param string $group - the group to return permissions of.
	 * @return bool
	 */
	public function isExecutableBy(string $group): bool {
		return Permissions::isExecutable($this->permissions, $group);
	}
}
