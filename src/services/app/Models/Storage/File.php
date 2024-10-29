<?php
/******************************************************************************\
|                                                                              |
|                                    File.php                                  |
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

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Models\Storage\Item;
use App\Models\Users\User;
use App\Models\Storage\Traits\ThumbnailViewable;
use App\Models\Storage\Traits\Compressable;
use App\Models\Storage\Traits\FileIndexable;
use App\Utilities\Uuids\Guid;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Storage\Permissions;
use App\Utilities\Strings\StringUtils;

class File extends Item
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use ThumbnailViewable, Compressable, FileIndexable;

	//
	// attributes
	//

	const THUMBDIR = '.Thumbs/';

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
		'size', 
		'place',
		'index_id',

		// access control
		//
		'permissions',

		// sharing
		//
		'link_id',
		'share_id',
		'owner',
		'num_shares',
		'num_links',

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
	public $appendables = [

		// access control
		//
		'permissions',

		// sharing
		//
		'owner',
		'num_shares',
		'num_links',

		// metadata
		//
		'size',
		'place',

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

		// access control
		//
		'permissions',

		// sharing
		//
		'owner'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'num_shares' => 'integer',
		'num_links' => 'integer',
	];

	//
	// file attributes accessor methods
	//

	/**
	 * Get this file's size attribute.
	 *
	 * @return int
	 */
	public function getSizeAttribute(): ?int {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if file exists
			//
			if (!$this->exists()) {
				return null;
			}

			// get size from local storage
			//
			return filesize($this->rootPath());
		} else {

			// get size from cloud storage
			//
			return Storage::size($this->getPath());
		}
	}

	/**
	 * Get this item's created at' timestamp attribute.
	 *
	 * @return int
	 */
	public function getCreatedAtAttribute(): ?int {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if file exists
			//
			if (!$this->exists()) {
				return null;
			}

			// get timestamp in local storage
			//
			return filemtime($this->rootPath());
		} else {

			// get timestamp in remote storage
			//
			return Storage::lastModified($this->rootPath());
		}
	}

	/**
	 * Get this item's modified at' timestamp attribute.
	 *
	 * @return int
	 */
	public function getModifiedAtAttribute(): ?int {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if file exists
			//
			if (!$this->exists()) {
				return null;
			}

			// get timestamp in local storage
			//
			return filectime($this->rootPath());
		} else {

			// get timestamp in remote storage
			//
			return Storage::lastModified($this->rootPath());
		}
	}

	/**
	 * Get this item's 'accessed at' timestamp attribute.
	 *
	 * @return int
	 */
	public function getAccessedAtAttribute(): ?int {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if file exists
			//
			if (!$this->exists()) {
				return null;
			}

			// get timestamp in local storage
			//
			return fileatime($this->rootPath());
		} else {

			// get timestamp in remote storage
			//
			return Storage::lastModified($this->rootPath());
		}
	}

	//
	// getting methods
	//


	/**
	 * Return root path to zip file contents.
	 *
	 * @return ZipArchive
	 */
	public function getRootPath() {
		if ($this->isLocal()) {
			return $this->rootPath();
		} else {
			return $this->getTempPath();
		}
	}

	/**
	 * Return temp path to file contents.
	 *
	 * @return string
	 */
	public function getTempPath() {

		// create temp directory
		//
		$tempDir = Storage::disk('local')->path('') . FileStorage::temp();
		if (!is_dir($tempDir)) {
			mkdir($tempDir);
		}

		// create temp file
		//
		$tempPath = $tempDir . '/' . basename($this->path);
		file_put_contents($tempPath, $this->readContents());

		return $tempPath;
	}

	/**
	 * Get this file's extension.
	 *
	 * @return string
	 */
	public function getExtension(): string {
		return pathinfo($this->path, PATHINFO_EXTENSION);
	}

	//
	// reading and writing methods
	//

	/**
	 * Get this file's contents.
	 *
	 * @return string
	 */
	public function readContents(): ?string {

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return false;
		}

		// check if file exists
		//
		if (!$this->exists()) {
			return false;
		}

		// read contents from storage
		//
		return $storage->read($this->getPath());
	}

	/**
	 * Write this file's contents.
	 *
	 * @param string $contents - the contents to write to the file.
	 * @return bool
	 */
	public function writeContents(?string $contents): bool {

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return false;
		}

		// check if file exists
		//
		if ($this->exists()) {
			return false;
		}

		// check params
		//
		if (!$contents) {
			$contents = '';
		}

		// write contents to storage
		//
		try {
			$storage->write($this->getPath(), $contents);
			return true;
		} catch (FilesystemException $exception) {
			return false;
		}
	}

	/**
	 * Put this file's contents.
	 *
	 * @param string $contents - the contents to put to the file.
	 * @return bool
	 */
	public function putContents(?string $contents, $metadata = null): bool {

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return false;
		}

		// check if file exists
		//
		if (!$this->exists()) {
			return false;
		}

		// check params
		//
		if (!$contents) {
			$contents = '';
		}

		// put literal contents to storage
		//
		try {
			$storage->put($this->getPath(), $contents, $metadata);
			return true;
		} catch (FilesystemException $exception) {
			return false;
		}
	}

	/**
	 * Put this file to storage from a local path.
	 *
	 * @param string $path - the (absolute) path to put the file to.
	 * @return bool
	 */
	public function putFrom(string $path): bool {

		// check if file exists
		//
		if (!$this->exists()) {
			return false;
		}

		// put contents from local storage to storage
		//
		try {
			$this->putContents(file_get_contents($path));
			return true;
		} catch (FilesystemException $exception) {
			return false;
		}
	}

	/**
	 * Put the contents of this file to local storage.
	 *
	 * @param string $path - the (absolute) path to put the file to.
	 * @return int - the number of bytes transferred
	 */
	public function putTo(string $path): int {

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return 0;
		}

		// check if file exists
		//
		if (!$this->exists()) {
			return 0;
		}

		// put contents to local storage from storage
		//
		return file_put_contents($path, $storage->get($this->getPath()));
	}

	//
	// updating methods
	//
	
	/**
	 * Update this file's contents.
	 *
	 * @param string $contents - the contents to change the file to.
	 * @return bool
	 */
	public function updateContents(?string $contents): bool {

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return false;
		}

		// check if file exists
		//
		if (!$this->exists()) {
			return false;
		}

		// check params
		//
		if (!$contents) {
			$contents = '';
		}

		// update contents in storage
		//
		try {
			$storage->write($this->getPath(), $contents);
			return true;
		} catch (FilesystemException $exception) {
			return false;
		}
	}

	/**
	 * Set this file's permissions.
	 *
	 * @param string $permissions - the permissions to set the file to.
	 * @return bool
	 */
	public function setPermissions(string $permissions): bool {

		// check if file exists
		//
		if (!$this->exists()) {
			return false;
		}
		
		// check which file system to use
		//
		if ($this->isLocal()) {

			// set permissions of file in local storage
			//
			return chmod($this->rootPath(), intval('0' . $permissions, 8));
		} else {

			// set permissions of file in remote storage
			//
			/*
			$metadata = $this->getMetadata();
			$metadata['permissions'] = $permissions;
			return $this->saveMetadata($metadata);
			*/
			return true;
		}
	}

	/**
	 * Copy this file to a destination.
	 *
	 * @param string $dest - the destination path to copy the file to.
	 * @return bool
	 */
	public function copyTo(string $dest): bool {

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return false;
		}

		return $storage->copy($this->getPath(), $this->homedir() . $dest);
	}

	/**
	 * Copy this file to a destination belonging to another user.
	 *
	 * @param App\Models\Users\User $user - the user to duplicate the file to.
	 * @param string $dest - the path to duplicate the file to.
	 * @return bool
	 */
	public function duplicateTo(User $user, string $dest): bool {
		return FileStorage::duplicate($this->getOwner(), $this->ownerPath(), $user, $dest);
	}

	//
	// downloading methods
	//

	/**
	 * Download this file.
	 *
	 * @return Illuminate\Support\Facades\Response
	 */
	public function download() {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// download file from local storage
			//
			return response()->download($this->rootPath());
		} else {

			// check if storage exists
			//
			$storage = $this->getStorage();
			if (!$storage) {
				return false;
			}

			// download file from cloud storage
			//
			return $storage->download($this->getPath());
		}
	}

	//
	// static methods
	//

	/**
	 * Remove a file from the file system.
	 *
	 * @param string $path - the absolute path of the file to remove.
	 * @return bool
	 */
	public static function remove(string $path): bool {
		return unlink($path);
	}
}