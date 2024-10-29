<?php
/******************************************************************************\
|                                                                              |
|                           ItemSizeConvertable.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait for converting storage file sizes.               |
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

use App\Utilities\Strings\StringUtils;

trait ItemSizeConvertable
{
	/**
	 * Convert item size from string to bytes.
	 *
	 * @param string $size - the size to convert to bytes.
	 * @return int
	 */
	public static function sizeToBytes(string $size): int {
		if (StringUtils::endsWith($size, 'K')) {
			return floatval(substr($size, 0, -1)) * 1000;
		} else if (StringUtils::endsWith($size, 'M')) {
			return floatval(substr($size, 0, -1)) * 1000 * 1000;
		} else if (StringUtils::endsWith($size, 'G')) {
			return floatval(substr($size, 0, -1)) * 1000 * 1000 * 1000;
		} else if (StringUtils::endsWith($size, 'T')) {
			return floatval(substr($size, 0, -1)) * 1000 * 1000 * 1000 * 1000;
		} else {
			return floatval($size);
		}
	}

	/**
	 * Convert item size from string to units.
	 *
	 * @param string $size - the size to convert to units.
	 * @param string $units - the type of units to convert to.
	 * @return int
	 */
	public static function sizeToUnits(string $size, string $units): int {
		$bytes = self::sizeToBytes($size);
		switch ($units) {
			case 'B':
				return $bytes;
			case 'K':
				return $bytes / 1000;
			case 'M':
				return $bytes / 1000 / 1000;
			case 'G':
				return $bytes / 1000 / 1000 / 1000;
			case 'T':
				return $bytes / 1000 / 1000 / 1000 / 1000;
		}
	}
}
