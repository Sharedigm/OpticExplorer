<?php
/******************************************************************************\
|                                                                              |
|                                S3Storage.php                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines utilities for accessing s3 file systems.                 |
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

use Aws\S3\S3Client as S3Client;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter as S3Adapter;

class S3Storage
{
	/**
	 * Get an S3 client
	 *
	 * @return object
	 */
	public static function getS3Client($attributes) {

		// check third party S3
		//
		if (array_key_exists('host', $attributes)) {

			// make sure that host starts with https
			//
			$host = $attributes['host'];
			if (!str_starts_with($host, 'https://')) {
				$host = 'https://' . $host;
			}

			// make sure that the region is not null
			//
			$region = $attributes['region'];
			if (!$region) {
				$region = 'default';
			}

			return S3Client::factory([
				'version' => 'latest',
				'endpoint' => $host,
				'region' => $region,
				'credentials' => [
					'key' => $attributes['key'],
					'secret' => $attributes['secret']
				]
			]);

		// check Amazon S3
		//
		} else {
			return S3Client::factory([
				'version' => 'latest',
				'region' => $attributes['region'],
				'credentials' => [
					'key' => $attributes['key'],
					'secret' => $attributes['secret']
				]
			]);
		}
	}

	/**
	 * Check if an S3 bucket exists
	 *
	 * @return bool
	 */
	public static function bucketExists($client, $bucketName) {
		return $client->doesBucketExist($bucketName);
	}

	/**
	 * Get an S3 file system adapter
	 *
	 * @return bool
	 */
	public static function getS3Adapter($attributes) {
		$client = self::getS3Client($attributes);
		if ($client && self::bucketExists($client, $attributes['bucket'])) {
			return new S3Adapter($client, $attributes['bucket']);
		} else {
			return null;
		}
	}
}