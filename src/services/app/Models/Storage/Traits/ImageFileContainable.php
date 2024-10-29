<?php
/******************************************************************************\
|                                                                              |
|                           ImageFileContainable.php                           |
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
use App\Models\Storage\Media\ImageFile;
use App\Models\Storage\Sharing\Share;

trait ImageFileContainable
{
	//
	// image file querying methods
	//

	/**
	 * Get the number of image files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return int
	 */
	public function numImageFiles(bool $recursive = false): int {
		$paths = $this->getFilePaths($recursive);
		$num = 0;

		for ($i = 0; $i < sizeof($paths); $i++) {
			if (ImageFile::isValidPath($paths[$i])) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the image files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getImageFiles(bool $recursive = false): Collection {
		$paths = $this->getFilePaths($recursive);
		$imageFiles = collect();

		for ($i = 0; $i < sizeof($paths); $i++) {
			$path = $paths[$i];
			if (ImageFile::isValidPath($path)) {
				$imageFiles->push(new ImageFile([
					'path' => $path
				]));
			}	
		}

		return $imageFiles;
	}

	//
	// shared image file querying methods
	//

	/**
	 * Get the number of shared image files contained in this directory.
	 *
	 * @return int
	 */
	public function numSharedImageFiles(): int {

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return 0;
		}

		// get shares belonging to the owner 
		// and contained by the directory path
		//
		$link = $this->link;
		$path = ($link? $link->path : '') . $this->path;
		$shares = Share::ofFiles()
			->belongingTo($owner->id)
			->containedBy($path)
			->get();

		// count image files
		//
		$num = 0;
		for ($i = 0; $i < sizeof($shares); $i++) {
			$share = $shares[$i];
			if (ImageFile::isValidPath($share->path)) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the shared image files contained in this directory.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSharedImageFiles(): Collection {
		$imageFiles = collect();

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return $imageFiles;
		}

		// get shares belonging to the owner 
		// and contained by the directory path
		//
		$link = $this->link;
		$path = ($link? $link->path : '') . $this->path;
		$shares = Share::ofFiles()
			->belongingTo($owner->id)
			->containedBy($path)
			->get();
		
		// create image files from paths 
		//
		for ($i = 0; $i < sizeof($shares); $i++) {
			$share = $shares[$i];
			if (ImageFile::isValidPath($share->path)) {
				$imageFiles->push(new ImageFile([
					'path' => $share->path,
					'share_id' => $share->id,
					'owner_id' => $share->owner_id
				]));
			}
		}

		return $imageFiles;
	}
}