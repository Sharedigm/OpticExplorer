<?php
/******************************************************************************\
|                                                                              |
|                           VideoFileContainable.php                           |
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
use App\Models\Storage\Media\VideoFile;
use App\Models\Storage\Sharing\Share;

trait VideoFileContainable
{
	//
	// video file querying methods
	//

	/**
	 * Get the number of video files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return int
	 */
	public function numVideoFiles(bool $recursive = false): int {
		$paths = $this->getFilePaths($recursive);
		$num = 0;

		for ($i = 0; $i < sizeof($paths); $i++) {
			if (VideoFile::isValidPath($paths[$i])) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the video files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getVideoFiles($recursive = false): Collection {
		$paths = $this->getFilePaths($recursive);
		$videoFiles = collect();

		for ($i = 0; $i < sizeof($paths); $i++) {
			$path = $paths[$i];
			if (VideoFile::isValidPath($path)) {
				$videoFiles->push(new VideoFile([
					'path' => $path
				]));
			}	
		}

		return $videoFiles;
	}

	//
	// shared video file querying methods
	//

	/**
	 * Get the number of shared video files contained in this directory.
	 *
	 * @return int
	 */
	public function numSharedVideoFiles(): int {

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

		// count audio files
		//
		$num = 0;
		for ($i = 0; $i < sizeof($shares); $i++) {
			$share = $shares[$i];
			if (VideoFile::isValidPath($share->path)) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the shared video files contained in this directory.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSharedVideoFiles(): Collection {
		$videoFiles = collect();

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return $sounds;
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
		
		// create audio files from paths 
		//
		for ($i = 0; $i < sizeof($shares); $i++) {
			$share = $shares[$i];
			if (VideoFile::isValidPath($share->path)) {
				$videoFiles->push(new VideoFile([
					'path' => $share->path,
					'share_id' => $share->id,
					'owner_id' => $share->owner_id
				]));
			}
		}

		return $videoFiles;
	}
}