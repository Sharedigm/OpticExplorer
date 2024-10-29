<?php
/******************************************************************************\
|                                                                              |
|                               ArchiveFile.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an abstract model of a storage system archive file.      |
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
use App\Models\Storage\File;
use App\Utilities\Storage\FileStorage;

class ArchiveFile extends File
{
	/**
	 * Create temp folder in local storage
	 *
	 * @return string - the path to the temp folder.
	 */
	public function getTempFolder() {
		$localRoot = Storage::disk('local')->path('');
		$temp = FileStorage::temp();

		// create temp directory
		//
		$tempDir = $localRoot . $temp;
		if (!is_dir($tempDir)) {
			mkdir($tempDir);
		}

		// create temp folder
		//
		$folderName = pathinfo(basename($this->path), PATHINFO_FILENAME);
		$folderDir = $temp . '/' . $folderName;
		$folderPath = $localRoot . $folderDir;
		if (!is_dir($folderPath)) {
			mkdir($folderPath);
		}

		return $folderDir;
	}

	/**
	 * Upload files to cloud system.
	 *
	 * @param string $src - the source directory to upload.
	 * @param string $dest - the destination to upload files to.
	 */
	public function uploadFiles($localSrc, $remoteDest) {
		$files = Storage::disk('local')->allFiles($localSrc);
		foreach ($files as $file) {

			// remove prefix
			//
			$name = substr($file, strlen($localSrc));

			// compute paths
			//
			$srcPath = Storage::disk('local')->path('') . $file;
			$destPath = $remoteDest . '/' . $name;

			// copy file
			//
			$contents = file_get_contents($srcPath);
			Storage::disk(FileStorage::filesystem())->put($destPath, $contents);
		}
	}
}