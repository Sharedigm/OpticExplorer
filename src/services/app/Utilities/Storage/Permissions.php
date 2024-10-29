<?php
/******************************************************************************\
|                                                                              |
|                               Permissions.php                                |
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

class Permissions
{
	public static $indices = [
		'owner' => [
			'r' => 0,
			'w' => 1,
			'x' => 2
		],
		'group'=> [
			'r' => 3,
			'w' => 4,
			'x' => 5
		],
		'other' => [
			'r' => 6,
			'w' => 7,
			'x' => 8
		]
	];

	//
	// conversion methods
	//

	/**
	 * Convert an octal digit to a permission string.
	 * For example: 
	 * 7 => 'rwx'
	 * 6 => 'rw-'
	 * 5 => 'r-x'
	 * 4 => 'r--'
	 * 3 => '-wx'
	 * 2 => '-w-'
	 * 1 => '--x'
	 * 0 => '---'
	 *
	 * @param $digit - the digit to convert.
	 * @return string
	 */
	public static function digitToString($digit): string {
		$binary = sprintf("%03b", intval($digit));
		$string = '';
		$string .= ($binary[0] == '1')? 'r' : '-';
		$string .= ($binary[1] == '1')? 'w' : '-';
		$string .= ($binary[2] == '1')? 'x' : '-';
		return $string;
	}

	/**
	 * Convert a permission string to a digit.
	 * For example: 
	 * 'rwx' => 7
	 * 'rw-' => 6
	 * 'r-x' => 5
	 * 'r--' => 4
	 * '-wx' => 3
	 * '-w-' => 2
	 * '--x' => 1
	 * '---' => 0
	 *
	 * @param string @string - the string to convert.
	 * @return int
	 */
	public static function stringToDigit(string $string): int {
		$value = 0;
		if ($string[0] == 'r') {
			$value += 4;
		}
		if ($string[1] == 'w') {
			$value += 2;
		}
		if ($string[2] == 'x') {
			$value += 1;
		}
		return strval($value);
	}

	/**
	 * Convert a sequence of 3 digits to a permissions string.
	 * For example: 
	 * '777' => 'rwxrwxrwx'
	 * '755' => 'rwxr-xr-x'
	 * '644' => 'rw-r--r--'
	 *
	 * @param string $digits - the digits to convert.
	 * @return string
	 */
	public static function digitsToString($digits) {
		$string = '';
		if (strlen($digits) >= 3) {
			for ($i = 0; $i < 3; $i++) {
				$string .= self::digitToString($digits[$i]);
			}
		}
		return $string;
	}

	/**
	 * Convert string to a sequence of three digits.
	 * For example: 
	 * 'rwxrwxrwx' => '777'
	 * 'rwxr-xr-x' => '755'
	 * 'rw-r--r--' => '644'
	 *
	 * @param string $digits - the character sequence to convert.
	 * @return string
	 */
	public static function stringToDigits(string $string) {
		$digits = '';
		if (strlen($string) >= 9) {
			$digits .= self::stringToDigit(substr($string, 0, 3));
			$digits .= self::stringToDigit(substr($string, 3, 3));
			$digits .= self::stringToDigit(substr($string, 6, 3));
		}
		return $digits;
	}

	//
	// setting methods
	//

	/**
	 * Set the readable flag of a permissions string.
	 *
	 * @param string $permissions - the permissions string to modify.
	 * @param string $group - the group 'owner', 'group', or 'other'.
	 * @param string $value - the value 'r' or '-'
	 * @return string
	 */
	public static function setReadable(string $permissions, string $group, string $value) {
		$string = self::digitsToString($permissions);
		$string[self::$indices[$group]['r']] = $value? 'r' : '-';
		return self::stringToDigits($string);
	}

	/**
	 * Set the writable flag of a permissions string.
	 *
	 * @param string $permissions - the permissions string to modify.
	 * @param string $group - the group 'owner', 'group', or 'other'.
	 * @param string $value - the value 'r' or '-'
	 * @return string
	 */
	public static function setWritable(string $permissions, string $group, string $value) {
		$string = self::digitsToString($permissions);
		$string[self::$indices[$group]['w']] = $value? 'w' : '-';
		return self::stringToDigits($string);
	}

	/**
	 * Set the executable flag of a permissions string.
	 *
	 * @param string $permissions - the permissions string to modify.
	 * @param string $group - the group 'owner', 'group', or 'other'.
	 * @param string $value - the value 'r' or '-'
	 * @return string
	 */
	public static function setExecutable(string $permissions, string $group, string $value) {
		$string = self::digitsToString($permissions);
		$string[self::$indices[$group]['x']] = $value? 'x' : '-';
		return self::stringToDigits($string);
	}

	/**
	 * Apply the permissions to another permissions string.
	 *
	 * @param string $permissions - the permissions string to modify.
	 * @param string $permissions - the permissions string to apply.
	 * @return string
	 */
	public static function apply(string $permissions, string $permissions2): string {

		// apply read permissions
		//
		$permissions2 = self::setReadable($permissions2, 'owner', self::isReadable($permissions, 'owner'));
		$permissions2 = self::setReadable($permissions2, 'group', self::isReadable($permissions, 'group'));
		$permissions2 = self::setReadable($permissions2, 'other', self::isReadable($permissions, 'other'));

		// apply write permissions
		//
		$permissions2 = self::setWritable($permissions2, 'owner', self::isWritable($permissions, 'owner'));
		$permissions2 = self::setWritable($permissions2, 'group', self::isWritable($permissions, 'group'));
		$permissions2 = self::setWritable($permissions2, 'other', self::isWritable($permissions, 'other'));
		
		return $permissions2;
	}

	//
	// querying methods
	//

	/**
	 * Get the readable flag of a permissions string.
	 *
	 * @param string $permissions - the permissions string to query.
	 * @param string $group - the group 'owner', 'group', or 'other'.
	 * @return bool
	 */
	public static function isReadable(string $permissions, string $group): bool {
		return $permissions != '' && self::digitsToString($permissions)[self::$indices[$group]['r']] == 'r';
	}

	/**
	 * Get the writable flag of a permissions string.
	 *
	 * @param string $permissions - the permissions string to query.
	 * @param string $group - the group 'owner', 'group', or 'other'.
	 * @return bool
	 */
	public static function isWritable(string $permissions, string $group): bool {
		return $permissions != '' && self::digitsToString($permissions)[self::$indices[$group]['w']] == 'w';
	}

	/**
	 * Get the executable flag of a permissions string.
	 *
	 * @param string $permissions - the permissions string to query.
	 * @param string $group - the group 'owner', 'group', or 'other'.
	 * @return bool
	 */
	public static function isExecutable(string $permissions, string $group): bool {
		return $permissions != '' && self::digitsToString($permissions)[self::$indices[$group]['x']] == 'x';
	}
}