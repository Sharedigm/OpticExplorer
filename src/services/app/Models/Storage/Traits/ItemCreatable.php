<?php
/******************************************************************************\
|                                                                              |
|                              ItemCreatable.php                               |
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

use App\Models\Storage\File;
use App\Models\Storage\Directory;
use App\Models\Storage\Media\AudioFile;
use App\Models\Storage\Media\ImageFile;
use App\Models\Storage\Media\VideoFile;

trait ItemCreatable
{
	//
	// static methods
	//

	/**
	 * Create a new file.
	 *
	 * @param string $path - the path to validate.
	 * @return App\Models\Storage\File
	 */
	static public function createFile(array $attributes) {
		$path = $attributes['path'];

		// create a file of the appropriate type
		//
		if (AudioFile::isValidPath($path)) {
			return new AudioFile($attributes);
		} else if (ImageFile::isValidPath($path)) {
			return new ImageFile($attributes);
		} else if (VideoFile::isValidPath($path)) {
			return new VideoFile($attributes);
		} else {
			return new File($attributes);
		}
	}

	/**
	 * Create a new item.
	 *
	 * @param string $path - the path to validate.
	 * @return App\Models\Storage\File
	 */
	static public function createItem(array $attributes) {
		$path = $attributes['path'];

		if (Directory::isValidPath($path)) {
			return new Directory($attributes);
		} else {
			return self::createFile($attributes);
		}
	}
}