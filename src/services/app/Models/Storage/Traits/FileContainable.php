<?php
/******************************************************************************\
|                                                                              |
|                             FileContainable.php                              |
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
use App\Models\Storage\File;
use App\Models\Storage\Directory;
use App\Utilities\Strings\StringUtils;

trait FileContainable
{
	//
	// accessor methods
	//

	/**
	 * Get this directory's files count attribute.
	 *
	 * @return int
	 */
	public function getNumFilesAttribute(): array {
		return $this->getNumFiles();
	}

	//
	// file querying methods
	//

	/**
	 * Get the number of files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return int
	 */
	public function numFiles(bool $recursive = false): int {
		return sizeof($this->getFilePaths($recursive));
	}

	/**
	 * Get the files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getFiles(bool $recursive = false): Collection {
		return $this->pathsToFiles($this->getFilePaths($recursive));
	}

	//
	// hidden file querying methods
	//

	/**
	 * Get the number of hidden files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return int
	 */
	public function numHiddenFiles(bool $recursive = false): int {
		$paths = $this->getFilePaths($recursive);
		$num = 0;

		for ($i = 0; $i < sizeof($paths); $i++) {
			$hidden = StringUtils::startsWith(basename($paths[$i]), '.')? 'true' : 'false';
			if (StringUtils::startsWith(basename($paths[$i]), '.')) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the hidden files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getHiddenFiles(bool $recursive = false): Collection {
		$paths = $this->getFilePaths($recursive);
		$hiddenFiles = collect();

		for ($i = 0; $i < sizeof($paths); $i++) {
			$path = $paths[$i];
			if (StringUtils::startsWith(basename($path), '.')) {
				$hiddenFiles->push(new File([
					'path' => $path
				]));
			}	
		}

		return $hiddenFiles;
	}

	//
	// conversion methods
	//

	/**
	 * Convert file paths to files.
	 *
	 * @param array $paths - the file paths to convert.
	 * @return Illuminate\Support\Collection
	 */
	public function pathsToFiles(array $paths): Collection {
		$files = collect();

		for ($i = 0; $i < sizeof($paths); $i++) {
			$files->push(Directory::createFile([
				'path' => $paths[$i],
				'volume' => $this->volume,
				'link_id' => $this->link_id,
				'share_id' => $this->share_id
			]));
		}

		// shared directories
		//
		if ($this->share) {

			// update paths from owner to local
			//
			for ($i = 0; $i < sizeof($files); $i++) {
				$files[$i]->path = str_replace($this->share->owner_path, $this->share->path, $files[$i]->path);
			}
		}

		return $files;
	}
}