<?php
/******************************************************************************\
|                                                                              |
|                                Password.php                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for performing password encryption.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Security;

class Password
{
	//
	// static querying methods
	//

	/**
	 * Encrypt a password.
	 *
	 * @param string $password - the password to encrypt.
	 * @param string $encryption - the type of encryption to use.
	 * @param string $hash - the password's hash.
	 * @return string
	 */
	public static function getEncrypted(string $password, string $encryption, string $hash = ''): string {
		switch (strtoupper($encryption)) {

			case 'NONE': 
				return $password;
				break;

			case 'MD5':
				return '{MD5}' . base64_encode(md5($password, true));
				break;

			case 'SHA':
			case 'SHA1':
				return '{' . $encryption . '}' . base64_encode(sha1($password, true));
				break;

			case 'SSHA':
				$salt = substr(base64_decode(substr($hash, 6)), 20);
				return '{SSHA}' . base64_encode(sha1($password . $salt, true) . $salt);
				break;

			case 'BCRYPT':
			default:
				return '{BCRYPT}' . password_hash($password, PASSWORD_BCRYPT);
				break;
		}
	}

	/**
	 * Get the encryption scheme of a hashed password.
	 *
	 * @param string $hash - the hashed password.
	 * @return string
	 */
	public static function getEncryption(string $hash): string {

		// if no encryption specified in curly brackets, must be plaintext
		//
		if ($hash[0] != '{') {
			return 'none';
		}

		// find substring between curly brackets
		//
		$i = 1;
		while ($hash[$i] != '}' && $i < strlen($hash)) {
			$i++;
		}
		return substr($hash, 1, $i - 1);
	}

	/**
	 * Determine if a password matches its hash.
	 *
	 * @param string $password - the enencrypted password.
	 * @param string $hash - the encrypted password.
	 * @return bool
	 */
	public static function isValid(string $password, string $hash): bool {

		// no password
		//
		if ($hash == '') {
			return false;
		}

		// find encryption method
		//
		$encryption = self::getEncryption($hash);

		switch (strtoupper($encryption)) {

			case 'NONE':
				return $password == $hash;

			case 'CRYPT':
				return (crypt($password, substr($hash, 7)) == substr($hash, 7));

			case 'MD5':
				$encryptedPassword = self::getEncrypted($password, $encryption);
				break;

			case 'SHA':
			case 'SHA1':
				$encryptedPassword = self::getEncrypted($password, $encryption);
				break;

			case 'SSHA':
				$encryptedPassword = self::getEncrypted($password, $encryption, $hash);
				break;

			case 'BCRYPT':
				return password_verify($password, substr($hash, 8));
				break;

			default:
				echo "Unsupported password hash format: " . $hash . ". ";
				return false;
		}

		return ($hash == $encryptedPassword);
	}
}