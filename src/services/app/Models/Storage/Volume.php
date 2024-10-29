<?php
/******************************************************************************\
|                                                                              |
|                                  Volume.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a storage system file.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Collection;
use League\Flysystem\Filesystem;
use App\Models\Storage\File;
use App\Models\Storage\Traits\ItemContainable;
use App\Utilities\Storage\FileSystems;
use App\Utilities\Strings\StringUtils;

class Volume extends File
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use ItemContainable;

	//
	// constants
	//

	public const EXTENSIONS = [
		's3',
		'gdrv',
		'dpbx'
	];

	//
	// attributes
	//

	/**
	 * The attributes that should be visible in serialization.
	 *
	 * @var array
	 */
	protected $visible = [

		// address
		//
		'path',
		'volume',

		// metadata
		//
		'num_files',
		'num_directories',
		'place',

		// access control
		//
		'permissions',

		// sharing
		//
		'link_id',
		'share_id',
		'owner',
		'num_links',
		'num_shares',
		
		// timestamps
		//
		'created_at',
		'modified_at',
		'accessed_at'
	];

	/**
	 * The accessors to append to the model's array form.
	 *
	 * @var array
	 */
	protected $appends = [

		// metadata
		//
		'num_files',
		'num_directories',

		// access control
		//
		'permissions',

		// sharing
		//
		'owner'
	];

	//
	// counts accessor methods
	//

	/**
	 * Get this directory's files count attribute.
	 *
	 * @return int
	 */
	public function getNumFilesAttribute(): array {
		return [
			'all' => null,
			'audio' => null,
			'image' => null,
			'video' => null,
			'hidden' => null
		];
	}

	/**
	 * Get this directory's directories count attribute.
	 *
	 * @return int
	 */
	public function getNumDirectoriesAttribute(): array {
		return [
			'all' => null,
			'hidden' => null
		];
	}

	/**
	 * Get storage from a volume path.
	 *
	 * @return Illuminate\Filesystem\FilesystemAdapter
	 */
	public function getStorage() {

		// check cached results
		//
		if (array_key_exists($this->path, self::$storage)) {
			return self::$storage[$this->path];
		}

		// read and parse volume data
		//
		$file = new File([
			'path' => $this->path,
			'link_id' => $this->link_id
		]);
		$volumeData = (array)json_decode($file->readContents());

		if (!$this->link_id) {
			$extension = $this->getExtension();
		} else {
			$linkPath = $file->link->path;
			$extension = pathinfo($linkPath, PATHINFO_EXTENSION);
		}

		// create new file system adapter
		//
		$storage = FileSystems::getFileSystemAdapter($extension, $volumeData);

		// save storage for later
		//
		self::$storage[$this->path] = $storage;

		// create new file system adapter
		//
		return $storage;
	}

	/**
	 * Get the paths of files contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return string[]
	 */
	public function getFilePaths(bool $recursive = false, $filter = null): array {
		$paths = [];

		// get cached value
		//
		if ($recursive) {
			if ($this->allFilePaths) {
				$paths = $this->allFilePaths;
			}
		} else {
			if ($this->filePaths) {
				$paths = $this->filePaths;
			}		
		}

		// get items relative to path
		//
		if (!$paths) {

			// check if storage exists
			//
			$storage = $this->getStorage();
			if (!$storage) {
				return [];
			}

			// get file paths from storage
			//
			if ($recursive) {
				$paths = $storage->allFiles('');
			} else {
				$paths = $storage->files('');
			}

			// cache value
			//
			if ($recursive) {
				$this->allFilePaths = $paths;
			} else {
				$this->filePaths = $paths;
			}
		}

		// filter paths
		//
		if ($filter) {
			$paths = $this->filterPaths($paths, $filter);
		}

		return $paths;
	}

	/**
	 * Get the paths of directories contained in this directory.
	 *
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return string[]
	 */
	public function getDirectoryPaths(bool $recursive = false, $filter = null): array {
		$paths = [];

		// get cached value
		//
		if ($recursive) {
			if ($this->allDirectoryPaths) {
				$paths = $this->allDirectoryPaths;
			}
		} else {
			if ($this->directoryPaths) {
				$paths = $this->directoryPaths;
			}		
		}

		// get items relative to path
		//
		if (!$paths) {

			// check if storage exists
			//
			$storage = $this->getStorage();
			if (!$storage) {
				return [];
			}

			// get paths from storage
			//
			if ($recursive) {
				$paths = $storage->allDirectories('');
			} else {
				$paths = $storage->directories('');
			}

			// cache paths
			//
			if ($recursive) {
				$this->allDirectoryPaths = $paths;
			} else {
				$this->directoryPaths = $paths;
			}
		}

		// filter paths
		//
		if ($filter) {
			$paths = $this->filterPaths($paths, $filter);
		}

		return $paths;
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
				'volume' => $this->path,
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
				'volume' => $this->path,
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

	//
	// static methods
	//

	/**
	 * Check if a path is valid for volumes.
	 *
	 * @param string $path - the video file path to query.
	 * @return bool
	 */
	static public function isValidPath(?string $path): bool {
		$extension = pathinfo($path, PATHINFO_EXTENSION);
		return in_array(strtolower($extension), self::EXTENSIONS);
	}
}