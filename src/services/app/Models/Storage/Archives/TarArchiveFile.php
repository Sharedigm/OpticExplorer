<?php
/******************************************************************************\
|                                                                              |
|                              TarArchiveFile.php                              |
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

use Illuminate\Support\Facades\Storage;
use App\Models\Storage\Directory;
use App\Models\Storage\Archives\ArchiveFile;
use App\Utilities\Strings\StringUtils;

class TarArchiveFile extends ArchiveFile
{
	//
	// querying methods
	//

	/**
	 * Get this tar archive's contents.
	 *
	 * @param string $dirname - the directory path to include.
	 * @param string $include - the file name prefix to require.
	 * @param string $exclude - the file name prefix to exclude.
	 * @return array
	 */
	public function getContents($dirname = null, $include = null, $exclude = null, $recursive = false): array {
		$contents = [];

		// get / create root path
		//
		$rootPath = $this->getRootPath();

		// get file names
		//
		if (StringUtils::endsWith($rootPath, 'gz')) {
			$script = 'tar -ztf ' . $rootPath;
		} else {
			$script = 'tar -tf ' . $rootPath;
		}
		$names = [];
		exec($script, $names);

		// get root directory name
		//
		if (!$dirname) {
			$dirname = '.';
		}

		// get contents from zip archive
		//
		for ($i = 0; $i < count($names); $i++) {
			$name = $names[$i];

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
								'path' => $name
							]);
						} else {
							array_push($contents, [
								'path' => $name
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

	//
	// methods
	//

	/**
	 * Extract this tar archive to the file system.
	 *
	 * @param string $dest - the destination to extract the archive to.
	 * @return bool
	 */
	public function extractTo(?string $dest = null): bool {

		// get / create root path
		//
		$rootPath = $this->getRootPath();

		// set default destination
		//
		if (!$dest) {
			$dest = dirname($this->rootPath());
		}

		// extract archive contents
		//
		if ($this->isLocal()) {

			// extract archive file
			//
			$command = 'tar -C ' . $dest . ' -xvf ' . $rootPath;
			$error = exec($command, $output, $error);
		} else {

			// create temp folder
			//
			$folderDir = $this->getTempFolder();

			// extract contents to temp folder
			//
			$folderPath = Storage::disk('local')->path('') . $folderDir;
			$command = 'tar -C ' . $folderPath . ' -xvf ' . $rootPath;
			$error = exec($command, $output, $error);

			// move results from temp to storage
			//
			$this->uploadFiles($folderDir, $dest);

			// remove temp file
			//
			if (file_exists($rootPath)) {
				unlink($rootPath);
			}
		}

		// return success
		//
		return true;
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