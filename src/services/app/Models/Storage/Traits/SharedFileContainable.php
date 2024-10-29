<?php
/******************************************************************************\
|                                                                              |
|                           SharedFileContainable.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait for items containing other items.                |
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

use Illuminate\Support\Collection;
use App\Models\Storage\Directory;
use App\Models\Storage\Sharing\Share;

trait SharedFileContainable
{
	//
	// shared file querying methods
	//

	/**
	 * Get the number of shared files contained in this directory.
	 *
	 * @return int
	 */
	public function numSharedFiles(): int {

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return 0;
		}

		// count shares belonging to the owner 
		// and contained by the directory path
		//
		$link = $this->link;
		$path = ($link? $link->path : '') . $this->path;
		return Share::ofFiles()
			->belongingTo($owner->id)
			->containedBy($path)
			->count();
	}

	/**
	 * Get the number of shared hidden files contained in this directory.
	 *
	 * @return int
	 */
	public function numSharedHiddenFiles(): int {

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return 0;
		}

		// count shares belonging to the owner 
		// and contained by the directory path
		// where the path starts with a dot
		//
		$link = $this->link;
		$path = ($link? $link->path : '') . $this->path;
		return Share::ofFiles()
			->belongingTo($owner->id)
			->containedBy($path)
			->where('path', 'like', '%/.%')
			->count();
	}

	//
	// shared file getting methods
	//

	/**
	 * Get the shared files contained in this directory.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSharedFiles($recursive): Collection {
		$files = collect();

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return $files;
		}

		// get shares belonging to the owner 
		// and contained by the directory path
		//
		$link = $this->link;
		$path = ($link? $link->path : '') . $this->path;
		$shares = Share::ofFiles()
			->belongingTo($owner->id)
			->containedBy($path, $recursive)
			->get();

		// create files from paths 
		//
		for ($i = 0; $i < sizeof($shares); $i++) {
			$share = $shares[$i];
			$files->push(Directory::createFile([
				'path' => $share->path,
				'share_id' => $share->id,
				'owner_id' => $share->owner_id
			]));
		}

		return $files;
	}
}