<?php
/******************************************************************************\
|                                                                              |
|                             ItemContainable.php                              |
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
use App\Models\Storage\Traits\FileContainable;
use App\Models\Storage\Traits\AudioFileContainable;
use App\Models\Storage\Traits\ImageFileContainable;
use App\Models\Storage\Traits\VideoFileContainable;
use App\Models\Storage\Traits\DirectoryContainable;
use App\Models\Storage\Traits\SharedFileContainable;
use App\Models\Storage\Traits\SharedDirectoryContainable;
use App\Utilities\Strings\StringUtils;

trait ItemContainable
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use FileContainable;
	use AudioFileContainable;
	use ImageFileContainable;
	use VideoFileContainable;
	use DirectoryContainable;
	use SharedFileContainable;
	use SharedDirectoryContainable;

	//
	// contents querying methods
	//

	/**
	 * Find if this item is empty.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return bool
	 */
	public function isEmpty(bool $recursive = true): bool {
		return $this->numItems($recursive) == 0 && $this->numSharedItems() == 0;
	}

	//
	// contents getting methods
	//

	/**
	 * Get this directory's files counts.
	 *
	 * @return array
	 */
	public function getNumFiles(): array {
		return [
			'all' => $this->numFiles() + $this->numSharedFiles(),
			'audio' => $this->numAudioFiles() + $this->numSharedAudioFiles(),
			'image' => $this->numImageFiles() + $this->numSharedImageFiles(),
			'video' => $this->numVideoFiles() + $this->numSharedVideoFiles(),
			'hidden' => $this->numHiddenFiles() + $this->numSharedHiddenFiles()
		];
	}

	/**
	 * Get this directory's directories counts.
	 *
	 * @return int
	 */
	public function getNumDirectories(): array {
		return [
			'all' => $this->numDirectories() + $this->numSharedDirectories(),
			'hidden' => $this->numHiddenDirectories() + $this->numSharedHiddenDirectories()
		];
	}

	/**
	 * Get the number of items contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return int
	 */
	public function numItems(bool $recursive = false): int {
		return $this->numFiles($recursive) + $this->numDirectories($recursive);
	}

	/**
	 * Get the items contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getItemPaths(bool $recursive = false): array {
		$filePaths = $this->getFilePaths($recursive);
		$directoryPaths = $this->getDirectoryPaths($recursive);
		return array_merge($filePaths, $directoryPaths);
	}

	/**
	 * Get the items contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return Illuminate\Support\Collection
	 */
	public function getItems(bool $recursive = false): Collection {
		$files = $this->getFiles($recursive);
		$directories = $this->getDirectories($recursive);
		return $files->merge($directories);
	}

	//
	// shared contents querying methods
	//

	/**
	 * Get the number of shared items contained in this directory.
	 *
	 * @return int
	 */
	public function numSharedItems(): int {
		return $this->numSharedFiles() + $this->numSharedDirectories();
	}

	/**
	 * Get the shared items contained in this directory.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getSharedItems($recursive): Collection {
		$files = $this->getSharedFiles($recursive);
		$directories = $this->getSharedDirectories($recursive);
		return $files->merge($directories);
	}

	//
	// path querying methods
	//

	/**
	 * Convert file paths to be local to directory
	 *
	 * @param array $paths - the paths to convert.
	 * @return string[]
	 */
	public function toLocalFilePaths(array $paths): array {

		// make paths relative to homedir
		//
		$homedir = $this->homedir();

		// strip homedir from start of paths
		//
		if (!str_starts_with($homedir, '/')) {
			$start = strlen($homedir);
			for ($i = 0; $i < count($paths); $i++) {
				$paths[$i] = substr($paths[$i], $start);
			}
		}

		// restore leading slashes
		//
		if (StringUtils::startsWith($this->path, '/')) {
			$paths = $this->prependPaths('/', $paths);
		}

		return $paths;
	}
	
	/**
	 * Filter paths according to regular expression.
	 *
	 * @param array $paths - the paths to filter.
	 * @param string $filter - the regular expression to use to filter.
	 * @return array
	 */
	public function filterPaths(array $paths, string $filter) {
		$filtered = [];

		// return paths that match filter
		//
		for ($i = 0; $i < count($paths); $i++) {
			$path = $paths[$i];
			if (!preg_match($filter, $path)) {
				array_push($filtered, $path);
			}
		}

		return $filtered;
	}

	/**
	 * Prepend a prefix to an array of paths
	 *
	 * @param string $prefix - the prefix to prepend.
	 * @param array $paths - the paths to prepend.
	 * @return string[]
	 */
	public function prependPaths(string $prefix, array $paths): array {
		$prepended = [];

		// prepend prefix to paths
		//
		for ($i = 0; $i < count($paths); $i++) {
			array_push($prepended, $prefix . $paths[$i]);
		}

		return $prepended;
	}

	/**
	 * Append a suffix to an array of paths
	 *
	 * @param string $suffix - the suffix to append.
	 * @param array $paths - the paths to prepend.
	 * @return string[]
	 */
	public function appendPaths(string $suffix, array $paths): array {
		$appended = [];

		// append suffix to paths
		//
		for ($i = 0; $i < sizeof($paths); $i++) {
			array_push($appended, $paths[$i] . $suffix);
		}

		return $appended;
	}
}