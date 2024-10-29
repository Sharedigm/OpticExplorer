<?php
/******************************************************************************\
|                                                                              |
|                                ExifWriter.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for dealing with Unix file permissions.        |
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

class ExifWriter
{
	/**
	 * Encode a model.
	 *
	 * @param $data - the data to encode.
	 * @return string
	 */
	public static function encode($data) {
		$string = '';
		$count = 0;
		foreach ($data as $key => $value) {
			$string .= $key . ':' . $value;
			$count++;
			if ($count < count($data)) {
				$string .= '; ';
			}
		}
		return $string;
	}

	/**
	 * Write exif data to a file
	 *
	 * @param $digit - the digit to convert.
	 * @return string
	 */
	public static function write($filename, $options): string {

		// compose metadata
		//
		$flags = '';
		foreach ($options as $key => $value) {
			if (!is_string($value)) {
				$value = self::encode($value);
			}
			$flags .= '-' . $key . '="' . $value . '" ';
		}

		// compose command
		//
		$executable = base_path('') . '/' . config('app.exif_tool_path');
		$command = $executable . ' -overwrite_original ' . $flags . ' ' . ' "' . $filename . '"';

		// run command
		//
		exec($command, $output, $resultCode);

		return $resultCode;
	}
}