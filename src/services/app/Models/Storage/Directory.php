<?php
/******************************************************************************\
|                                                                              |
|                                 Directory.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a storage system directory.                   |
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

use ZipArchive;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use App\Models\Storage\File;
use App\Models\Storage\FileIndex;
use App\Models\Storage\Item;
use App\Models\Users\User;
use App\Models\Users\Auth\UserSession;
use App\Models\Storage\Traits\ItemCreatable;
use App\Models\Storage\Traits\ItemContainable;
use App\Models\Storage\Traits\ItemSizeConvertable;
use App\Utilities\Uuids\Guid;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Storage\Permissions;
use App\Utilities\Strings\StringUtils;

class Directory extends Item
{
	/**
	 * The traits that are inherited.
	 *
	 */
	use ItemCreatable;
	use ItemContainable;
	use ItemSizeConvertable;

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
		'is_empty',
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
		'num_indices',

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
		'num_links',
		'num_shares',

		// metadata
		//
		'is_empty',
		'num_files',
		'num_directories',
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
		'owner',

		// metadata
		//
		'is_empty'
	];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		'num_links' => 'integer',
		'num_shares' => 'integer',
		'num_indices' => 'integer'
	];

	//
	// accessor methods
	//

	/**
	 * Get this directory's is_empty attribute.
	 *
	 * @return bool
	 */
	public function getIsEmptyAttribute(): ?bool {
		if (!$this->volume && $this->isLocal()) {
			return $this->isEmpty();
		} else {
			return null;
		}
	}

	/**
	 * Get this directory's num_indices attribute.
	 *
	 * @return int
	 */
	public function getNumIndicesAttribute(): ?int {
		return FileIndex::where('user_id', '=', Session::get('user_id'))
			->where('path', 'like', $this->path . '%')->count();
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
			return null;
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
			return null;
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
			return null;
		}
	}

	//
	// creating methods
	//

	/**
	 * Make a new directory.
	 *
	 * @return bool
	 */
	public function make(): bool {

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return false;
		}

		// make directory in storage
		//
		return $storage->makeDirectory($this->getPath());
	}

	//
	// querying methods
	//

	/**
	 * Find if this directory is root.
	 *
	 * @return bool
	 */
	public function isRoot(): bool {
		return (!$this->path) || ($this->path == '');
	}

	/**
	 * Find if this directory is the user's public directory.
	 *
	 * @return bool
	 */
	public function isPublic(): bool {
		return StringUtils::endsWith(FileStorage::current(), '/Public/');
	}

	/**
	 * Find if this directory is a hidden / system directory.
	 *
	 * @return bool
	 */
	public function isHidden(): bool {
		return StringUtils::startsWith(basename($this->path), '.');
	}

	/**
	 * Find if this directory is the user's home directory.
	 *
	 * @return bool
	 */
	public function isHome(): bool {
		return $this->isRoot() && !$this->isPublic();
	}

	/**
	 * Find if this item exists in the file system.
	 *
	 * @return bool
	 */
	public function exists(): bool {
		if ($this->isHome()) {
			return true;
		}

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if exists in local storage
			//
			return file_exists($this->rootPath());
		} else {

			// check if storage exists
			//
			$storage = $this->getStorage();
			if (!$storage) {
				return false;
			}

			// check if exists in remote storage
			//
			return $this->path != '/'? $storage->exists($this->getPath()) : true;
		}
	}

	/**
	 * Get this directory's parent.
	 *
	 * @return App\Models\Storage\Directory
	 */
	public function getParent(): Directory {
		return new self([
			'path' => dirname($this->path),
			'link_id' => $this->link_id,
			'share_id' => $this->share_id
		]);
	}

	/**
	 * Get this diretory's size.
	 *
	 * @param string $units - the units of size to report.
	 * @return int
	 */
	public function getSize(string $units = null): int {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check local storage
			//
			switch ($units) {
				case 'B':
					$output = shell_exec('du -sk ' . $this->rootPath());
					return floatval(explode("\t", $output)[0]) * 1024;
				case 'K':
					$output = shell_exec('du -sk ' . $this->rootPath());
					return floatval(explode("\t", $output)[0]);
				case 'M':
					$output = shell_exec('du -sk ' . $this->rootPath());
					return floatval(explode("\t", $output)[0]) / 1024;
				case 'G':
					$output = shell_exec('du -sk ' . $this->rootPath());
					return floatval(explode("\t", $output)[0]) / 1024 / 1024;
				case 'T':
					$output = shell_exec('du -sk ' . $this->rootPath());
					return floatval(explode("\t", $output)[0]) / 1024 / 1024 / 1024;
				default:
					$output = shell_exec('du -sh ' . $this->rootPath());
					return explode("\t", $output)[0];	
			}
		} else {

			// check cloud storage
			//
			return 0;
		}
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

			// get paths from storage
			//
			if ($recursive) {
				$paths = $storage->allFiles($this->getPath());
			} else {
				$paths = $storage->files($this->getPath());
			}

			// convert paths to UTF-8 encoding
			//
			for ($i = 0; $i < count($paths); $i++) {
				$paths[$i] = mb_convert_encoding($paths[$i], 'UTF-8');
			}

			if (!$this->volume) {

				// make paths relative to homedir
				//
				$paths = $this->toLocalFilePaths($paths);		
			}

			// cache paths
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
				$paths = $storage->allDirectories($this->getPath());
			} else {
				$paths = $storage->directories($this->getPath());
			}

			// convert paths to UTF-8 encoding
			//
			for ($i = 0; $i < count($paths); $i++) {
				$paths[$i] = mb_convert_encoding($paths[$i], 'UTF-8');
			}

			// make paths relative to homedir
			//
			if (!$this->volume) {
				$paths = $this->toLocalFilePaths($paths);
			}

			// cache value
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

	public function getHiddenDirectoryPaths(bool $recursive = false, $filter = null): array {
		$paths = $this->getDirectoryPaths();

		// return paths starting with .
		//
		return $this->filterPaths($paths, function($path) {
			return StringUtils::startsWith(basename($path), '.'); 
		});
	}

	/**
	 * Get the paths of shared files contained in this directory.
	 *
	 * @return string[]
	 */
	public function getSharedFilePaths(): array {
		$paths = [];

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return $paths;
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

		// get paths from shares
		//
		for ($i = 0; $i < sizeof($shares); $i++) {
			array_push($paths, $shares[$i]->path);
		}

		return $paths;
	}

	/**
	 * Get the paths of shared directories contained in this directory.
	 *
	 * @return string[]
	 */
	public function getSharedDirectoryPaths(): array {
		$paths = [];

		// find the owner
		//
		$owner = $this->getOwner();
		if (!$owner) {
			return $paths;
		}

		// get shares belonging to the owner 
		// and contained by the directory path
		//
		$link = $this->link;
		$path = ($link? $link->path : '') . $this->path;
		$shares = Share::ofDirectories()
			->belongingTo($owner->id)
			->containedBy($path)
			->get();

		// get paths from shares
		//
		for ($i = 0; $i < sizeof($shares); $i++) {
			array_push($paths, $shares[$i]->path);
		}

		return $paths;
	}

	//
	// compression methods
	//

	/**
	 * Compress this directory to an archive file.
	 *
	 * @param string $dest - the path to the archive file to create.
	 * @return ZipArchive
	 */
	public function compressTo(string $dest): ZipArchive {

		// get local directory
		//
		if ($this->isLocal()) {
			$path = $this->rootPath();
		} else {
			$path = $this->toTemp();
		}

		// compress local directory
		//
		$bytes = self::compressDirectory($path, $dest);

		// remove temp local directoey
		//
		if (!$this->isLocal()) {
			self::delete($path);
		}

		return $bytes;
	}

	//
	// updating methods
	//

	/**
	 * Set this directory's permissions.
	 *
	 * @param string $permissions - the permissions to set.
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return void
	 */
	public function setPermissions(string $permissions, bool $recursive = false) {
		/*
		chmod($this->rootPath(), intval('0' . $permissions, 8));
		*/
		self::setDirectoryPermissions($this->fullPath(), intval('0' . $permissions, 8), $recursive);
	}
	
	/**
	 * Move this directory to a destination path.
	 *
	 * @param string $dest - the destination to move the item to.
	 * @return bool
	 */
	public function moveTo(string $dest): bool {

		// move item in storage
		//
		return self::moveDirectory($this->fullPath(), $this->homedir() . $dest);
	}

	/**
	 * Copy this directory to a destination.
	 *
	 * @param string $dest - the destination path to copy to.
	 * @return bool
	 */
	public function copyTo(string $dest): bool {
		return self::copyDirectory($this->fullPath(), $this->homedir() . $dest);
	}

	/**
	 * Copy this directory to another user's destination.
	 *
	 * @param App\Models\Users\User $user - the user to duplicate to.
	 * @param string $dest - the path to duplicate to.
	 * @return bool
	 */
	public function duplicateTo(User $user, string $dest): bool {
		return FileStorage::duplicateDirectory($this->getOwner(), $this->ownerPath(), $user, $dest);
	}

	/**
	 * Transfer the contents of this directory.
	 *
	 * @param string $path - the path to put.
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @param int $mode - the file permissions to put.
	 * @return int - the number of bytes transferred.
	 */
	public function putTo(string $path, bool $recursive = true, int $mode = 0777): int {
		$dirpath = $this->fullPath();
		$bytes = 0;

		// create new directory
		//
		mkdir($path, 0777);
		
		// put files to new directory
		//
		$filepaths = $this->getFilePaths();
		for ($i = 0; $i < count($filepaths); $i++) {
			$filepath = $filepaths[$i];
			$filename = basename($filepath);
			$file = new File([
				$path => $dirpath . '/' . $filename
			]);
			$bytes += $file->putTo($path . '/' . $filename);
		}

		// put directories to new directory
		//
		$dirpaths = $this->getDirectoryPaths();
		for ($i = 0; $i < count($dirpaths); $i++) {
			$dirpath = $dirpaths[$i];
			$dirname = basename($dirpath);
			$directory = new self([
				'path' => $dirpath
			]);
			if ($recursive) {
				$bytes += $directory->putTo($path . '/' . $dirname);
			} else {
				mkdir($path . '/' . $dirname);
			}
		}

		return $bytes;
	}

	/**
	 * Clear this directory's contents.
	 *
	 * @return bool
	 */
	public function clear(): bool {
		$path = $this->fullPath();

		// delete sharing
		//
		parent::clear();

		// check if storage exists
		//
		$storage = $this->getStorage();
		if (!$storage) {
			return false;
		}

		// delete files
		//
		$files = $storage->files($path);
		for ($i = 0; $i < sizeof($files); $i++) {
			if (!$storage->delete($files[$i])) {
				return false;
			}
		}

		// delete directories
		//
		$directories = $storage->directories($path);
		for ($i = 0; $i < sizeof($directories); $i++) {
			if (!$storage->deleteDirectory($directories[$i])) {
				return false;
			}
		}

		// delete any shared items in directory
		//
		$this->deleteShares();

		return true;
	}

	//
	// deleting methods
	//

	/**
	 * Remove the contents of a directory from the file system.
	 *
	 * @return App\Models\Storage\FileIndex[]
	 */
	public function deleteIndices() {
		return FileIndex::where('user_id', '=', Session::get('user_id'))
			->where('path', 'like', $this->path . '%')->delete();
	}

	/**
	 * Delete this directory.
	 *
	 * @return bool
	 */
	public function delete(): bool {

		// check if item has been shared directly
		//
		if ($this->isShared()) {

			// delete item from database
			//
			$this->unshare();
			return $this->share->delete();

		// check if item is contained in a shared directory
		//
		} else if ($this->share) {

			// delete item from user storage
			//
			return FileStorage::deleteDirectory($this->getOwner(), $this->ownerPath());

		// item is not a shared directory
		//
		} else {

			// check if storage exists
			//
			$storage = this->getStorage();
			if (!$storage) {
				return false;
			}

			// delete item from storage
			//
			return $storage->deleteDirectory($this->fullPath());
		}
	}

	//
	// static methods
	//

	/**
	 * Check if a path is valid for directories.
	 *
	 * @param string $path - the path to validate.
	 * @return bool
	 */
	static public function isValidPath(?string $path): bool {
		return StringUtils::endsWith($path, '/');
	}

	/**
	 * Move a directory to a destination.
	 *
	 * @param string $path - the source path to copy from.
	 * @param string $dest - the destination path to copy to.
	 * @return bool
	 */
	public static function moveDirectory(string $path, string $dest): bool {
		if (config('filesystems.default') != 's3') {

			try {
				Storage::move($path, $dest);
				return true;
			} catch (FilesystemException | UnableToMoveFile $exception) {
				return false;
			}
		} else {

			// make new destination directory
			//
			if (!Storage::makeDirectory($dest)) {
				return false;
			}

			// trim trailing slashes
			//
			if (StringUtils::endsWith($path, '/')) {
				$path = substr($path, 0, strlen($path) - 1);
			}
			if (StringUtils::endsWith($dest, '/')) {
				$dest = substr($dest, 0, strlen($dest) - 1);
			}

			// copy files
			//
			$files = Storage::files($path);
			for ($i = 0; $i < sizeof($files); $i++) {
				$from = $files[$i];
				$file = substr($from, strlen($path));
				if ($dest != '') {
					$to = $dest . '/' . $file;
				} else {
					$to = $file;
				}
				if (!Storage::move($from, $to)) {
					return false;
				}
			}

			// copy directories
			//
			$directories = Storage::directories($path);
			for ($i = 0; $i < sizeof($directories); $i++) {
				$from = $directories[$i];
				$directory = substr($from, strlen($path));
				if ($dest != '') {
					$to = $dest . '/' . $directory;
				} else {
					$to = $directory;
				}
				if (!self::moveDirectory($from, $to)) {
					return false;
				}
			}

			// remove source directory
			//
			if (!Storage::deleteDirectory($path)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Copy a directory to a destination.
	 *
	 * @param string $path - the source path to copy from.
	 * @param string $dest - the destination path to copy to.
	 * @return bool
	 */
	public static function copyDirectory(string $path, string $dest): bool {

		// make new destination directory
		//
		if (!Storage::makeDirectory($dest)) {
			return false;
		}

		// trim trailing slashes
		//
		if (StringUtils::endsWith($path, '/')) {
			$path = substr($path, 0, strlen($path) - 1);
		}
		if (StringUtils::endsWith($dest, '/')) {
			$dest = substr($dest, 0, strlen($dest) - 1);
		}

		// copy files
		//
		$files = Storage::files($path);
		for ($i = 0; $i < sizeof($files); $i++) {
			$from = $files[$i];
			$file = substr($from, strlen($path));
			if ($dest != '') {
				$to = $dest . '/' . $file;
			} else {
				$to = $file;
			}
			if (!Storage::copy($from, $to)) {
				return false;
			}
		}

		// copy directories
		//
		$directories = Storage::directories($path);
		for ($i = 0; $i < sizeof($directories); $i++) {
			$from = $directories[$i];
			$directory = substr($from, strlen($path));
			if ($dest != '') {
				$to = $dest . '/' . $directory;
			} else {
				$to = $directory;
			}
			if (!self::copyDirectory($from, $to)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Compress a directory to a destination.
	 *
	 * @param string $source - the source path of files to compress.
	 * @param string $dest - the destination of the compressed archive.
	 * @return ZipArchive
	 */
	public static function compressDirectory(string $source, string $dest): ZipArchive {

		// initialize archive object
		//
		$zip = new ZipArchive();
		$zip->open($dest, ZipArchive::CREATE | ZipArchive::OVERWRITE);

		// create recursive directory iterator
		//
		$files = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator($source),
			RecursiveIteratorIterator::LEAVES_ONLY
		);

		// create top level directory
		//
		// $basename = pathinfo($dest, PATHINFO_FILENAME);
		// $zip->addEmptyDir($basename);

		// add contents to archive
		//
		foreach ($files as $name => $file) {

			// get real and relative path for current file
			//
			$filePath = $file->getRealPath();
			if (StringUtils::startsWith($filePath, '/private')) {
				$filePath = substr($filePath, strlen('/private'));
			}

			if (strlen($filePath) > strlen($source)) {
				$relativePath = substr($filePath, strlen($source));

				// skip directories (they would be added automatically)
				//
				if (!$file->isDir()) {

					// add current file to archive
					//
					$zip->addFile($filePath, $relativePath);
				} else {

					// add directory to archive
					//
					$zip->addEmptyDir($relativePath);
				}
			}
		}

		// zip archive will be created only after closing object
		//
		$zip->close();

		// return zip file
		//
		return $zip;
	}

	/**
	 * Set a directory's permissions.
	 *
	 * @param string $path - the path of the directory to set permissions of.
	 * @param string $permissions - the permissions to set.
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return void
	 */
	public static function setDirectoryPermissions(string $path, string $permissions, bool $recursive) {
		$rootPath = FileStorage::root();

		if (!FileStorage::isLocal()) {
			return;
		}

		// change permissions of directory
		//
		chmod($rootPath . '/' . $path, $permissions);

		// change permissions of directory contents
		//
		if ($recursive) {

			// change file permissions
			//
			$files = Storage::files($path);
			for ($i = 0; $i < sizeof($files); $i++) {
				chmod($rootPath . '/' . $files[$i], $permissions);
			}

			// change directory permissions
			//
			$directories = Storage::directories($path);
			for ($i = 0; $i < sizeof($directories); $i++) {
				self::setDirectoryPermissions($directories[$i], $permissions, $recursive);
			}
		}
	}

	//
	// recursive delete methods
	//

	/**
	 * Remove the contents of a directory from the file system.
	 *
	 * @param string $path - the absolute path of the directory to remove.
	 * @return bool
	 */
	public static function removeContents(string $path): bool {
		$items = array_diff(scandir($path), ['.', '..']);
		foreach ($items as $item) {
			$itemPath = realpath($path) . '/' . $item;

			// delete item and return if not successful
			//
			if (is_dir($itemPath)) {
				$success = self::remove($itemPath);
			} else if (is_file($itemPath)) {
				$success = File::remove($itemPath);
			}

			if (!$success) {
				return false;
			}
		}
	}

	/**
	 * Remove a directory from the file system.
	 *
	 * @param string $path - the absolute path of the directory to remove.
	 * @return bool
	 */
	public static function remove(string $path): bool {
		if (self::removeContents($path)) {
			return rmdir($path);
		}
	}
}