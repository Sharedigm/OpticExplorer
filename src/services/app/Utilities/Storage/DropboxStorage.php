<?php
/******************************************************************************\
|                                                                              |
|                              DropboxStorage.php                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines utilities for accessing Dropbox file systems.            |
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

use Spatie\Dropbox\Client as DropboxClient;
use Spatie\FlysystemDropbox\DropboxAdapter;

class DropboxStorage
{
	/**
	 * Get a Dropbox file system adapter
	 *
	 * @return bool
	 */
	public static function getDropboxAdapter($attributes) {

		// create Dropbox Client
		//
		$client = new DropboxClient($attributes['access_token']);

		// create Dropbox Driver
		//
		return new DropboxAdapter($client);
	}
}