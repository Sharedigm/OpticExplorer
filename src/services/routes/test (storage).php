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
use Illuminate\Filesystem\FilesystemManager;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\HtmlString;
use League\Flysystem\Filesystem;
use App\Models\Users\User;

// ftp adapters
//
use League\Flysystem\Ftp\FtpAdapter;
use League\Flysystem\Ftp\FtpConnectionOptions;

// sftp adapters
//
use League\Flysystem\PhpseclibV3\SftpAdapter;
use League\Flysystem\PhpseclibV3\SftpConnectionProvider;
use League\Flysystem\UnixVisibility\PortableVisibilityConverter;

// s3 adapters
//
use Aws\S3\S3Client as S3Client;
use League\Flysystem\AwsS3v3\AwsS3Adapter as S3Adapter;

// dropbox adapters
//
use Spatie\Dropbox\Client as DropboxClient;
use Spatie\FlysystemDropbox\DropboxAdapter as DropboxAdapter;

// google adapters
//
use Google_Service_Drive as GoogleServiceDrive;
use \Google\Client as GoogleClient;
use \Masbug\Flysystem\GoogleDriveAdapter as GoogleDriveAdapter;

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

Route::get('test', function() {
	// return print_r(Storage::disk('local')->getAdapter()->prefixer->prefix, 1);
	return print_r(Storage::disk('local')->path(''), 1);
});

/*
//
// sms test
//

Route::get('test/sms', function() {
	try {
		Nexmo::message()->send([
			'to'   => '16083355955',
			'from' => '18665207192',
			'text' => 'Using the facade to send a message.'
		]);  
	} catch (Exception $e) {
		dd("Error: ". $e->getMessage());
	}
});

Route::get('test/sms2', function() {
	try {
		$basic  = new \Nexmo\Client\Credentials\Basic(getenv("NEXMO_KEY"), getenv("NEXMO_SECRET"));
		$client = new \Nexmo\Client($basic);

		$message = $client->message()->send([
			'to' => '16083355955',
			'from' => config('services.nexmo.sms_from'),
			'text' => "This is a Nexmo test!"
		]);

		dd('SMS Sent Successfully.');	  
	} catch (Exception $e) {
		dd("Error: ". $e->getMessage());
	}
});
*/

/*
//
// translation test
//

Route::get('test/translation', function() {
	return Translation::translate([
		"Hello, world.", 
		"How are you?"
	], 'English', 'French');
}
*/

//
// file system tests
//

Route::get('test/ftp', function() {

	// test routes:
	// http://localhost/sharedigm-server/public/api/directory/contents?path=PonyExpressRawData%2FDEM%20%26%20DSM%2Fphase-1%2F&volume=External%2FVoxelmaps.ftp
	// http://localhost/sharedigm-server/public/api/directory/contents?path=PonyExpressRawData%2FDEM%20%26%20DSM%2Fphase-1%2FDEM%20Geotiff%2F&volume=External%2FVoxelmaps.ftp

	/*
	$volumeData = [
		"host" => "abemegahed.com",
		"username" => "abemegahed",
		"password" => "2ManyCats!!",
		"port" => 21,
		"root" => "/public_html",
		"passive" => true,
		"ssl" => true
	];
	*/

	$volumeData = [
		"host" => "44.234.193.106",
		"username" => "ftp-full",
		"password" => "ardency-spangle-shirting",
		"port" => 21,
		"root" => "PonyExpressRawData/DEM & DSM/phase-1/DEM Geotiff",
		"passive" => true,
		"ssl" => true
	];

	$adapter = new FtpAdapter(FtpConnectionOptions::fromArray([
		'host' => $volumeData['host'], 				// required
		'root' => $volumeData['root'], 				// required
		'username' => $volumeData['username'], 		// required
		'password' => $volumeData['password'], 		// required
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

	// create file system
	//
	$filesystem = new Filesystem($adapter);
	$storage = new FilesystemAdapter($filesystem, $adapter);

	return array_merge($storage->files(), $storage->directories());
});

Route::get('test/sftp', function() {
	$volumeData = [
		"host" => "sharedigm.com",
		"username" => "root",
		"password" => "2ManyCats!!",
		"port" => 22,
		"root" => "",
		"passive" => true,
		"ssl" => true
	];

	$adapter = new SftpAdapter(
		new SftpConnectionProvider(
			$volumeData['host'],
			$volumeData['username'],
			$volumeData['password'], 			
			null, 
			null, 
			$volumeData['port'], 
			false, 
			60, 
			10, 
			null, 
			null,
		),
		$volumeData['root'],
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

	// create file system
	//
	$filesystem = new Filesystem($adapter, ['case_sensitive' => true]);
	$storage = new FilesystemAdapter($filesystem, $adapter);

	return array_merge($storage->files(), $storage->directories());
});

Route::get('test/dropbox', function() {

	// create Dropbox Client
	//
	$authorizationToken = 'K4gTATWnZ0AAAAAAAAAAAUni390TvKtRcLdge8LGzEeVmqlpMyg4RhJ4iQAkn9Yy';
	$client = new DropboxClient($authorizationToken);

	// create Dropbox Driver
	//
	$adapter = new DropboxAdapter($client);
	$filesystem = new Filesystem($adapter, ['case_sensitive' => true]);
	$storage = new FilesystemAdapter($filesystem, $adapter);

	return array_merge($storage->files(), $storage->directories());
});

Route::get('test/google', function() {

	// create Google Client
	//
	$client = new GoogleClient();
	$client->setClientId('48944764740-ja738go8po8hr8ugd46agqv2s2nfqglt.apps.googleusercontent.com');
	$client->setClientSecret('BVwWrFGZ6Nu18jxIyvoAx4b4'); 
	// $client->refreshToken('1//04fV28wvkHISfCgYIARAAGAQSNwF-L9Iri7zHSj1EC7PHiHWK6JrsWtLUMwH6FICXcqnWE4OGf9VurbZQ3VADzNbERFoikrsEFp4');

	// create Google Driver
	//
	$service = new GoogleServiceDrive($client);
	$adapter = new GoogleDriveAdapter($service);
	$filesystem = new \League\Flysystem\Filesystem($adapter);
	$storage = new FilesystemAdapter($filesystem, $adapter);

	return array_merge($storage->files(), $storage->directories());
});

Route::get('test/google-s3', function() {

	$s3Client = S3Client::factory(array(
		'version' => 'latest',
		'key' => 'AKIAJMXXKKWOF6TZE24Qy', 
		'secret' => 'smhubmyQEpK2jMu+pfk05i760mpX1Nq8mKA3+G/K',
		'region' => 'us-east-2'
	));

	$objects = $s3Client->getIterator('ListObjects', [
		'Bucket' => 'data-science-institute', 
		'MaxKeys' => 1000, 
		'Prefix' => null
	]);

	if ($objects) {
		$filenames = [];
		foreach ($objects as $object) {
			$filenames[] = $object['Key'];
		}
		return $filenames;
	} else {
		return 'null';
	}
});

Route::get('test/s3', function() {

	$s3Client = S3Client::factory(array(
		'version' => 'latest',
		'key' => 'AKIAJMXXKKWOF6TZE24Qy', 
		'secret' => 'smhubmyQEpK2jMu+pfk05i760mpX1Nq8mKA3+G/K',
		'region' => 'us-east-2'
	));

	$objects = $s3Client->getIterator('ListObjects', [
		'Bucket' => 'amegahed', 
		'MaxKeys' => 1000, 
		'Prefix' => null
	]);

	if ($objects) {
		$filenames = [];
		foreach ($objects as $object) {
			$filenames[] = $object['Key'];
		}
		return $filenames;
	} else {
		return 'null';
	}
});