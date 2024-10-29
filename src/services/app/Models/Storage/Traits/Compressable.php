<?php
/******************************************************************************\
|                                                                              |
|                               Compressable.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of a storage system item.                        |
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

use ZipArchive;

trait Compressable
{
	//
	// compression methods
	//

	/**
	 * Compress this file to an archive file.
	 *
	 * @param string $dest
	 * @return ZipArchive
	 */
	public function compressTo(string $dest) {

		// initialize archive object
		//
		$zip = new ZipArchive();
		$zip->open($dest, ZipArchive::CREATE | ZipArchive::OVERWRITE);

		// add this file to archive
		//
		$zip->addFile(realpath($this->rootPath()), $this->path);

		// zip archive will be created only after closing object
		//
		$zip->close();

		// return zip file
		//
		return $zip;
	}
}
