<?php
/******************************************************************************\
|                                                                              |
|                                Attachment.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of file attachment.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage\Attachments;

use App\Models\TimeStamps\TimeStamped;
use App\Models\Storage\File;
use App\Models\Storage\Directory;
use App\Models\Storage\Media\AudioFile;
use App\Models\Storage\Media\ImageFile;
use App\Models\Storage\Media\VideoFile;
use App\Http\Controllers\Storage\PermissionController;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Strings\StringUtils;

abstract class Attachment extends TimeStamped
{
	//
	// querying methods
	//

	/**
	 * Finds whether this attachment's item exists.
	 *
	 * @return bool
	 */
	public function hasItem(): bool {
		return FileStorage::has($this->item->user, $this->path);	
	}

	//
	// querying methods
	//

	/**
	 * Get this attachment's absolute path.
	 *
	 * @return string
	 */
	public function rootPath(): string {

		// return path to item in root file system
		//
		return FileStorage::root() . $this->fullPath();
	}

	/**
	 * Get this attachment's full path.
	 *
	 * @return string
	 */
	public function fullPath(): string {

		// return root path
		//
		if (str_starts_with($this->path, '/')) {
			return substr($this->path, 1);
		}

		// return path to item in local storage
		//
		return $this->homedir() . $this->path;
	}

	/**
	 * Get this attachment's home directory.
	 *
	 * @return string
	 */
	public function homedir(): string {
		return $this->item->user->account->username . '/';
	}

	/**
	 * Convert this attachment to an item.
	 *
	 * @return App\Models\Storage\Item
	 */
	public function toItem() {
		$path = '/' . $this->item->user->account->username . '/' . $this->path;
		$item = Directory::createItem([
			'path' => $path
		]);

		// append image resolution
		//
		if ($item instanceof ImageFile) {
			$item->append('resolution');
		}

		return $item;
	}

	/**
	 * Get this attachment's item's path
	 *
	 * @return string
	 */
	public function getItemPath() {
		$path = $this->path;
		$name = basename($path);
		if (Directory::isValidPath($path)) {
			return $name? $name . '/' : $path;
		} else {
			return $name? $name : $path;
		}
	}

	/**
	 * Allow queries for this item to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, string $userId) {

		// find attachment by user id
		//
		return $query->whereHas('item', function($query) use ($userId) {
			$query->where('user_id', '=', $userId);
		});
	}

	//
	// methods
	//

	/**
	 * Clear this attachment's item.
	 *
	 * @return App\Models\Topics\Attachments\Attachment
	 */
	public function clear() {

		// delete item if it is a copy
		//
		if ($this->copy) {
			$item = $this->toItem();
			$directory = new Directory([
				'path' => dirname($item->path)
			]);
			
			$item->delete();

			// remove item's directory
			//
			if ($directory->numImageFiles(false) == 0 && 
				$directory->numAudioFiles(false) == 0) {
				$directory->delete();
			}
		}

		return $this;
	}
}