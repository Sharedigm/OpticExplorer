<?php
/******************************************************************************\
|                                                                              |
|                           DirectoryContainable.php                           |
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
use App\Utilities\Strings\StringUtils;

trait DirectoryContainable
{
	//
	// accessor methods
	//

	/**
	 * Get this directory's directories count attribute.
	 *
	 * @return int
	 */
	public function getNumDirectoriesAttribute(): array {
		return $this->getNumDirectories();
	}

	//
	// directory querying methods
	//

	/**
	 * Get the number of directories contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return int
	 */
	public function numDirectories(bool $recursive = false): int {
		return sizeof($this->getDirectoryPaths($recursive));
	}

	/**
	 * Get the number of hidden directories contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function numHiddenDirectories(bool $recursive = false): int {
		$paths = $this->getDirectoryPaths($recursive);
		$num = 0;

		for ($i = 0; $i < sizeof($paths); $i++) {
			if (StringUtils::startsWith(basename($paths[$i]), '.')) {
				$num++;
			}
		}

		return $num;
	}

	/**
	 * Get the directories contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getDirectories(bool $recursive = false): Collection {	
		return $this->pathsToDirectories($this->getDirectoryPaths($recursive));
	}

	/**
	 * Get the hidden directories contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getHiddenDirectories(bool $recursive = false): Collection {
		return $this->pathsToDirectories($this->getHiddenDirectoryPaths($recursive));
	}
	
	//
	// conversion methods
	//

	/**
	 * Convert directory paths to directories.
	 *
	 * @param string $paths - the paths to directories.
	 * @return Illuminate\Support\Collection
	 */
	public function pathsToDirectories(array $paths): Collection {
		$directories = collect();

		for ($i = 0; $i < sizeof($paths); $i++) {
			$directories->push(new Directory([
				'path' => $paths[$i] . '/',
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
			for ($i = 0; $i < sizeof($directories); $i++) {
				$directories[$i]->path = str_replace($this->share->owner_path, $this->share->path, $directories[$i]->path);
			}
		}

		return $directories;
	}
}