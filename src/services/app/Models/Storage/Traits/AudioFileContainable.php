<?php
/******************************************************************************\
|                                                                              |
|                           AudioFileContainable.php                           |
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
use App\Models\Storage\Media\AudioFile;
use App\Models\Storage\Sharing\Share;

trait AudioFileContainable
{
	//
	// audio file querying methods
	//

	/**
	 * Get the number of audio files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return int
	 */
	public function numAudioFiles(bool $recursive = false): int {
		$paths = $this->getFilePaths($recursive);
		$num = 0;

		for ($i = 0; $i < sizeof($paths); $i++) {
			if (AudioFile::isValidPath($paths[$i])) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the audio files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getAudioFiles(bool $recursive = false): Collection {
		$paths = $this->getFilePaths($recursive);
		$audioFiles = collect();

		for ($i = 0; $i < sizeof($paths); $i++) {
			$path = $paths[$i];
			if (AudioFile::isValidPath($path)) {
				$audioFiles->push(new AudioFile([
					'path' => $path
				]));
			}	
		}

		return $audioFiles;
	}

	//
	// shared audio file querying methods
	//

	/**
	 * Get the number of shared audio files contained in this directory.
	 *
	 * @return int
	 */
	public function numSharedAudioFiles(): int {

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
			if (AudioFile::isValidPath($share->path)) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the shared audio files contained in this directory.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSharedAudioFiles(): Collection {
		$audioFiles = collect();

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
			if (AudioFile::isValidPath($share->path)) {
				$audioFiles->push(new AudioFile([
					'path' => $share->path,
					'share_id' => $share->id,
					'owner_id' => $share->owner_id
				]));
			}
		}

		return $audioFiles;
	}
}