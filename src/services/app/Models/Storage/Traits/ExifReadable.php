<?php
/******************************************************************************\
|                                                                              |
|                               ExifReadable.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of an exif readable storage system item.         |
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

trait ExifReadable
{
	/**
	 * Read this image file's exif data.
	 *
	 * @return Illuminate\Support\Facades\Response
	 */
	public function readExif(): ?array {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// check if file exits
			//
			if (!$this->exists()) {
				return null;
			}

			// read exif data of local file
			//
			try {

				// read using php exif
				//
				$exif = exif_read_data($this->rootPath());
				self::utf8_encode_deep($exif);
			} catch (\Exception $e) {

				// read using exiftool
				//
				$exif = null;
				// $exif = $this->readExifTool();
			}

			// filter NAN elements from exif
			//
			if ($exif) {
				array_walk_recursive($exif, function (&$value, $key) {
					if (is_numeric($value) && is_nan($value)) {
						$value = 'unknown';
					}
				});
			}

			return $exif;
		} else {

			// create image from data
			//
			$image = \Image::make($this->readContents());

			// extract exif data from image
			//
			return $image->exif();
		}

		return null;
	}

	/**
	 * Read this image file's detailed exif data using exif tools.
	 *
	 * @return Illuminate\Support\Facades\Response
	 */
	public function readExifTool(): ?array {

		// check which file system to use
		//
		if ($this->isLocal()) {

			// read exif data of local file
			//
			try {
				$path = $this->rootPath();
				$executable = base_path('') . '/' . config('app.exif_tool_path');
				$command = $executable . ' "' . $path . '"';
				$output = shell_exec($command);
				$lines = explode("\n", $output);
				$attributes = [];
				for ($i = 0; $i < count($lines); $i++) {
					$line = $lines[$i];
					$pair = explode(":", $line, 2);
					if (count($pair) == 2) {
						$key = trim($pair[0]);
						$value = trim($pair[1]);
						$attributes[$key] = $value;
					}
				}
				return $attributes;
			} catch (\Exception $e) {
				return null;
			}
		}

		return null;
	}
}