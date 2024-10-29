<?php
/******************************************************************************\
|                                                                              |
|                                FTPStorage.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines utilities for accessing FTP file systems.                |
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

use League\Flysystem\Ftp\FtpAdapter;
use League\Flysystem\Ftp\FtpConnectionOptions;
use League\Flysystem\PhpseclibV3\SftpAdapter;
use League\Flysystem\PhpseclibV3\SftpConnectionProvider;
use League\Flysystem\UnixVisibility\PortableVisibilityConverter;

class FTPStorage
{
	/**
	 * Get an FTP file system adapter
	 *
	 * @return bool
	 */
	public static function getFtpAdapter($attributes) {
		return new FtpAdapter(FtpConnectionOptions::fromArray([

			// options
			//
			'host' => $attributes['host'],
			'root' => $attributes['root'],
			'username' => $attributes['username'],
			'password' => $attributes['password'],

			// defaults
			//
			'port' => 21,
			'ssl' => false,
			'timeout' => 90,
			'utf8' => false,
			'passive' => true,
			'transferMode' => FTP_BINARY,
			'systemType' => null, 						// 'windows' or 'unix'
			'ignorePassiveAddress' => null, 			// true or false
			'timestampsOnUnixListingsEnabled' => false, // true or false
			'recurseManually' => true 					// true 
		]));
	}

	/**
	 * Get an SFTP file system adapter
	 *
	 * @return bool
	 */
	public static function getSftpAdapter($attributes) {
		return new SftpAdapter(
			new SftpConnectionProvider(
				$attributes['host'],
				$attributes['username'],
				$attributes['password'], 			
				null, 
				null, 
				$attributes['port'], 
				false, 
				60, 
				10, 
				null, 
				null,
			),
			$attributes['root'],
			PortableVisibilityConverter::fromArray([
				'file' => [
					'public' => 0777,
					'private' => 0755,
				],
				'dir' => [
					'public' => 0777,
					'private' => 0755,
				],
			])
		);
	}
}