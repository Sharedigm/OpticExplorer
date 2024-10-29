<?php
/******************************************************************************\
|                                                                              |
|                              ZipArchiveFile.php                              |
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

namespace App\Models\Storage\Archives;

use ZipArchive;
use Illuminate\Support\Facades\Storage;
use App\Models\Storage\Directory;
use App\Models\Storage\Archives\ArchiveFile;
use App\Utilities\Strings\StringUtils;

class ZipArchiveFile extends ArchiveFile
{
	/**
	 * Create a zip archive from this file.
	 *
	 * @return ZipArchive
	 */
	public function toZipArchive($path) {

		// create zip archive
		//
		$zipArchive = new ZipArchive();

		// create archive from file
		//
		if (!$zipArchive->open($path)) {
			return false;
		}

		return $zipArchive;
	}

	//
	// getting methods
	//

	/**
	 * Get this zip archive's contents.
	 *
	 * @param string $dirname - the directory path to include.
	 * @param string $include - the file name prefix to require.
	 * @param string $exclude - the file name prefix to exclude.
	 * @return array
	 */
	public function getContents($dirname = null, $include = null, $exclude = null, $recursive = false): array {
		$contents = [];
		$tempPath = null;

		// open zip archive
		//
		$rootPath = $this->getRootPath();
		$zipArchive = $this->toZipArchive($rootPath);

		// check for zip archive
		//
		if (!$zipArchive) {
			return [];
		}

		// get root directory name
		//
		if (!$dirname) {
			$dirname = '.';
		}

		// get contents from zip archive
		//
		for ($i = 0; $i < $zipArchive->numFiles; $i++) {
			$stat = $zipArchive->statIndex($i);
			$name = $stat['name'];

			// find if item is in the target path
			//
			if (dirname($name) == $dirname || 
				dirname($name) . '/' == $dirname || 
				($recursive && ($dirname == '.' || StringUtils::startsWith(dirname($name) . '/', $dirname)))) {

				// find if item is included by filter
				//
				if ($include == null || $include == basename($name)) {

					// find if item is not excluded by filter
					//
					if ($exclude == null || !StringUtils::startsWith($name, $exclude)) {
						if (self::isFileName($name)) {
							array_push($contents, [
								'path' => $stat['name'],
								'size' => $stat['size'],
								'created_at' => $stat['mtime']
							]);
						} else {
							array_push($contents, [
								'path' => $stat['name'],
								'created_at' => $stat['mtime']
							]);
						}
					}
				}
			}
		}

		// remove temp file
		//
		if (!$this->isLocal()) {
			if (file_exists($rootPath)) {
				unlink($rootPath);
			}
		}

		return $contents;
	}

	/**
	 * Get the names of the items contained in this zip archive.
	 *
	 * @param string $dirname - the directory path to include.
	 * @param string $include - the file name prefix to require.
	 * @param string $exclude - the file name prefix to exclude.
	 * @param bool $recursive - whether or not to include subdirectories.
	 * @return string[] 
	 */
	public function getNames(string $dirname = null, string $include = null, string $exclude = null, bool $recursive = false): array {
		$names = [];

		// open zip archive
		//
		$rootPath = $this->getRootPath();
		$zipArchive = $this->toZipArchive($rootPath);

		// check for zip archive
		//
		if (!$zipArchive) {
			return [];
		}

		// get root directory name
		//
		if (!$dirname) {
			$dirname = '.';
		}

		// get contents from zip archive
		//
		for ($i = 0; $i < $zipArchive->numFiles; $i++) {
			$stat = $zipArchive->statIndex($i);
			$name = $stat['name'];

			// find if item is in the target path
			//
			if (dirname($name) == $dirname || 
				dirname($name) . '/' == $dirname || 
				($recursive && ($dirname == '.' || StringUtils::startsWith(dirname($name) . '/', $dirname)))) {

				// find if item is included by filter
				//
				if ($include == null || $include == basename($name)) {

					// find if item is not excluded by filter
					//
					if ($exclude == null || !StringUtils::startsWith($name, $exclude)) {
						if (self::isFileName($name)) {
							array_push($names, $stat['name']);
						} else {
							array_push($names, $stat['name']);
						}
					}
				}
			}
		}

		// remove temp file
		//
		if (!$this->isLocal()) {
			if (file_exists($rootPath)) {
				unlink($rootPath);
			}
		}

		return $names;
	}

	//
	// methods
	//

	/**
	 * Extract this zip archive to the file system.
	 *
	 * @param string $dest - the destination to extract the archive to.
	 * @return bool
	 */
	public function extractTo(?string $dest = null, string $exclude = null): bool {

		// open zip archive
		//
		$rootPath = $this->getRootPath();
		$zipArchive = $this->toZipArchive($rootPath);

		// check for zip archive
		//
		if (!$zipArchive) {
			return false;
		}

		// find items to include
		//
		$names = $this->getNames(null, null, $exclude, true);

		// set default destination
		//
		if (!$dest) {
			$dest = dirname($this->rootPath());
		}

		// extract archive contents
		//
		if ($this->isLocal()) {
			$success = $zipArchive->extractTo($dest, $names);

			// close archive after extraction
			//
			$zipArchive->close();
		} else {

			// create temp folder
			//
			$folderDir = $this->getTempFolder();

			// extract contents to temp folder
			//
			$folderPath = Storage::disk('local')->path('') . $folderDir;
			$success = $zipArchive->extractTo($folderPath, $names);

			// close archive after extraction
			//
			$zipArchive->close();

			// move results from temp to storage
			//
			$this->uploadFiles($folderDir, $dest);

			// remove temp file
			//
			if (file_exists($rootPath)) {
				unlink($rootPath);
			}
		}

		return $success;
	}

	//
	// static methods
	//

	/**
	 * Find if a path belongs to a file.
	 *
	 * @param string $path - the file path to query.
	 * @return bool
	 */
	private static function isFileName(string $path): bool {
		return $path[strlen($path) - 1] != '/';
	}

	/**
	 * Find if a path belongs to a directory.
	 *
	 * @param string $path - the file path to query.
	 * @return bool
	 */
	private static function isDirectoryName(string $path): bool {
		return $path[strlen($path) - 1] == '/';
	}
}
