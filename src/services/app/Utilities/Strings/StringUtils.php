<?php
/******************************************************************************\
|                                                                              |
|                               StringUtils.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for some basic string operations.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Strings;

class StringUtils
{
	//
	// string utility methods
	//

	/**
	 * Determine if a string starts with a substring.
	 *
	 * @param string $haystack - the source string.
	 * @param string $needle - the string to search for.
	 * @return bool
	 */
	public static function startsWith($haystack, $needle): bool {
		$length = strlen($needle);
		return (substr($haystack, 0, $length) === $needle);
	}

	/**
	 * Determine if a string ends with a substring.
	 *
	 * @param string $haystack - the source string.
	 * @param string $needle - the string to search for.
	 * @return bool
	 */
	public static function endsWith($haystack, $needle): bool {	
		$length = strlen($needle);
		if ($length == 0) {
			return true;
		}
		return (substr($haystack, -$length) === $needle);
	}

	/**
	 * Determine if a string contains a substring.
	 *
	 * @param string $haystack - the source string.
	 * @param string $needle - the string to search for.
	 * @return bool
	 */
	public static function contains($haystack, $needle): bool {	
		return strpos($haystack, $needle) !== false;
	}
}