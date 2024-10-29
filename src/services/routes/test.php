<?php
/******************************************************************************\
|                                                                              |
|                                   test.php                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the REST API routes used by the application.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Aws\S3\S3Client as S3Client;
use League\Flysystem\AwsS3v3\AwsS3Adapter as S3Adapter;
use App\Models\Users\Storage\UserStorage;
use App\Utilities\Uuids\Guid;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('environment', function() {
	return App::environment();
});

//
// file system tests
//

Route::get('test', function() {
	$userStorage = new UserStorage([
		'id' => Guid::create(),
		'user_id' => 'fd97394f-81a3-8ca0-3a40-db3c155feb72',
		'host' => 'web.s3.wisc.edu',
		'key' => 'syRZY2c0F1Ofci4xWxQl',
		'secret' => 'DR8JjFJoJw4iL6y1nfFPPqHaQnaOjGhZHx9SzsSh',
		'region' => 'us-east-2',
		'bucket' => 'fkuusisto-bucket-01'
	]);
	$userStorage->save();
});

Route::get('test/s3', function() {

	$s3Client = S3Client::factory(array(
		'endpoint' => 'https://web.s3.wisc.edu',
		'version' => 'latest',
		'credentials' => [
			'key' => 'syRZY2c0F1Ofci4xWxQl', 
			'secret' => 'DR8JjFJoJw4iL6y1nfFPPqHaQnaOjGhZHx9SzsSh'
		],
		'region' => 'us-east-2'
	));

	if ($s3Client->doesBucketExist('fkuusisto-bucket-01')) {
		return 'true';
	} else {
		return 'false';
	}
});