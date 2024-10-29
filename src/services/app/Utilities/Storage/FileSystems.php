<?php
/******************************************************************************\
|                                                                              |
|                                FileSystems.php                               |
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

namespace App\Utilities\Storage;

use Illuminate\Filesystem\FilesystemAdapter;
use League\Flysystem\Filesystem;
use App\Utilities\Storage\FTPStorage;
use App\Utilities\Storage\S3Storage;
use App\Utilities\Storage\DropboxStorage;

class FileSystems
{
	//
	// file system driver methods
	//

	/**
	 * Get a Storage file system adapter
	 *
	 * @return bool
	 */
	public static function getFileSystemAdapter($type, $attributes) {
				
		// create adapter
		//
		switch ($type) {
			case 'ftp':
				$adapter = FTPStorage::getFtpAdapter($attributes);
				break;
			case 'sftp':
				$adapter = FTPStorage::getSftpAdapter($attributes);
				break;
			case 's3':
				$adapter = S3Storage::getS3Adapter($attributes);
				break;
			case 'dpbx':
				$adapter = DropboxStorage::getDropboxAdapter($attributes);
				break;
			default:
				$adapter = null;
		}

		// create file system adapter
		//
		if ($adapter) {
			$filesystem = new Filesystem($adapter, ['case_sensitive' => true]);
			$storage = new FilesystemAdapter($filesystem, $adapter);
		} else {
			$storage = null;
		}

		return $storage;
	}
}