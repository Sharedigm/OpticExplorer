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

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Storage\ImageFile;
use App\Models\Users\User;
use App\Models\AI\ImageGenerator;
use App\Models\AI\ImageGeneratorTokens;
use App\Utilities\Storage\ExifWriter;
use Illuminate\Http\UploadedFile;
use GuzzleHttp\Client;

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

//
// token testing
//

Route::get('users/{id}/add-tokens', function(Request $request, string $userId) {

	// get all image generators
	//
	$generators = ImageGenerator::where('enabled', '=', 1)->orderBy('order', 'ASC')->get();

	// check if current user has tokens
	//
	for ($i = 0; $i < count($generators); $i++) {
		$generators[$i]->addTokensFor($userId);
	}

	return $generators;
});

//
// stability.ai testing
//

Route::get('stability.ai/generate', function() {
	$url = env('STABILITY_AI_API_ENDPOINT') . '/text-to-image';
	$token = env('STABILITY_AI_API_TOKEN');

	// make request
	//
	$response = Http::withToken($token)
		->timeout(60)
		->post($url, [
			'text_prompts' => [[
				"text" => 'Closeup photo of Christina Hendricks dressed as a witch with a broomstick and a flying monkey.' 
			]],
			'width' => 1024,
			'height' => 1024
		]);

	// check response code
	//
	if ($response->status() != 200) {
		return $response;
	}

	$data = base64_decode($response['artifacts'][0]['base64']);
	return response($data)->header('Content-type','image/png');
});

Route::get('stability.ai/enhance', function() {
	$url = env('STABILITY_AI_API_ENDPOINT') . '/image-to-image';
	$token = env('STABILITY_AI_API_TOKEN');
	$filepath = '/Users/tribble/Sites/user-data/dreamer/places/00-mcardle.png';
	$imagedata = file_get_contents($filepath);

	$data = [
		'init_image_mode' => 'IMAGE_STRENGTH',
		'image_strength' => 0.35,
		'steps' => 40,
		'seed' => 0,
		'cfg_scale' => 5,
		'samples' => 1,
		"text_prompts" => [
			[
				"text" => "Building crumbling, cracking, disintigrating, broken windows, flames, fire, inferno, disaster, crowds of people",
				"weight" => 1
			], [
				"text" => "blurry, bad",
				"weight" => -1
			]
		]
	];

	// make request
	//
	$response = Http::attach('init_image', $imagedata)
		->withToken($token)
		->timeout(60)
		->post($url, getMultipartFormData($data));

	// check response code
	//
	if ($response->status() != 200) {
		echo "Error code: " . $response->status() . "<br />";
		echo "Error reason: " . $response->getReasonPhrase() . "<br />";
		return print_r($response, 1);
	}

	$data = base64_decode($response['artifacts'][0]['base64']);
	return response($data)->header('Content-type','image/png');
});

//
// openai testing
//

function getMultipartFormData($postData) {
	$multipart = [];
	$vars = explode('&', http_build_query($postData));
	foreach ($vars as $var) {
		list($nameRaw, $contentsRaw) = explode('=', $var);
		$name = urldecode($nameRaw);
		$contents = urldecode($contentsRaw);
		$multipart[] = [
			'name' => $name, 
			'contents' => $contents
		];
	}
	return $multipart;
}

Route::get('openai/generate', function() {
	$url = env('OPENAI_API_ENDPOINT') . '/generations';
	$token = env('OPENAI_API_KEY');

	// make request
	//
	$response = Http::withToken($token)
		->timeout(60)
		->post($url, [
		'prompt' => 'Closeup photo of Christina Hendricks dressed as a witch with a broomstick and a flying monkey.',
		'model' => 'dall-e-3',
		'n' => 1,
		'quality' => 'standard',
		'size' => '1024x1024',
		'style' => 'vivid'
	]);

	// check response code
	//
	if ($response->status() != 200) {
		echo "Error code: " . $response->status() . "<br />";
		echo "Error reason: " . $response->getReasonPhrase() . "<br />";
		return $response;
	}

	$data = file_get_contents($response['data'][0]['url']);
	return response($data)->header('Content-type','image/png');
});

Route::get('openai/enhance', function() {
	$url = env('OPENAI_API_ENDPOINT') . '/edits';
	$token = env('OPENAI_API_KEY');
	$filepath = '/Users/tribble/Sites/user-data/dreamer/places/00-mcardle.png';
	$maskpath = '/Users/tribble/Sites/user-data/dreamer/places/mask.png';
	$imagedata = file_get_contents($filepath);
	$maskdata = file_get_contents($maskpath);

	$data = [
		'prompt' => "Building crumbling, cracking, disintigrating, broken windows, flames, fire, inferno, disaster, crowds of people",
		'n' => 1
	];

	// make request
	//
	$response = Http::attach('image', $imagedata, 'image.png')
		->attach('mask', $maskdata, 'mask.png')
		->withToken($token)
		->timeout(60)
		->post($url, $data);

	// check response code
	//
	if ($response->status() != 200) {
		echo "Error code: " . $response->status() . "<br />";
		echo "Error reason: " . $response->getReasonPhrase() . "<br />";
		return $response;
	}

	$data = file_get_contents($response['data'][0]['url']);
	return response($data)->header('Content-type','image/png');
});

//
// stable diffusion api testing
//

Route::get('stablediffusionapi', function() {

	// make request
	//
	$response = Http::timeout(60)->post(env('STABLE_DIFFUSION_API_ENDPOINT'), [
		'key' => env('STABLE_DIFFUSION_API_KEY'),
		'prompt' => 'Closeup photo of a beautiful woman dressed as a witch with a broomstick and a flying monkey.',
		'width' => 1024,
		'height' => 1024
	]);

	// check response code
	//
	if ($response->status() != 200) {
		return null;
	}

	$data = file_get_contents($response['output'][0]);
	return response($data)->header('Content-type','image/png');
});

//
// exif texting
//

Route::group(['middleware' => 'verify.storage_access'], function() {
	Route::get('file', function() {
		$file = new ImageFile([
			'path' => 'Images/image653b0fc6d206a.png'
		]);
		return $file;
	});

	Route::get('read-exif', function() {
		$path = '/Users/tribble/Sites/user-data/dreamer/1698949239.png';
		$command = '/usr/local/bin/exiftool ' . $path;
		$output = '';
		$resultCode = '';
		exec($command, $output, $resultCode);
		// $path = '/Users/tribble/Sites/user-data/amegahed/Pictures/IMG_0032 (800x600).jpg';
		// $data = exif_read_data($path);
		return $output;
	});

	Route::get('write-exif', function() {

		/*
		$prompt = 'Queen Elizabeth dressed as Rambo shooting an Ar-15.';
		$filename = 'image653b0fc6d206a.png';
		$prompt = 'Hitler dancing ballet in a frilly pink tutu.';
		$filename = 'image653b1590ec76b.png';
		$prompt = 'Photo of Christina Hendricks dressed as a punk goth witch riding on a broomstick.';
		$filename = 'image6538b168020a8.png';
		$prompt = 'Christina Hendricks in a punk rock outfit.';
		$filename = 'image65385e0b4faa9.png';
		$prompt = 'Donald trump in an orange prison jumpsuit in jail.';
		$filename = 'image653856e177d43.png';
		$prompt = 'A Barbie doll in punk attire at a concert.';
		$filename = 'image65375660e1626.png';
		*/

		$prompt = 'The McArdle Building.';
		$artist = 'Abe Megahed';
		$generator = 'Stability AI';
		$seed = '1234';
		$steps = 40;
		$filename = '00-mcardle.png';

		// write exif info
		//
		$file = new ImageFile([
			'path' => $filename
		]);
		$rootPath = $file->rootPath();
		ExifWriter::write($rootPath, [
			'Description' => $prompt,
			'Artist' => $artist,
			'Make' => $generator,
			'Model' => [
				'seed' => $seed,
				'steps' => $steps
			]
		]);

		// return info
		//
		return $file;
	});

	Route::get('write-exif2', function() {
		$filepath = '1698949239.png';
		$prompt = 'A witch in a bowling alley.';
		$negativePrompt = '';
		$cfgScale = 7.0;
		$samples = 1;
		$seed = 1234;
		$steps = 30;
		$stylePreset = 'anime';

		// create file
		//
		$file = new ImageFile([
			'path' => $filepath
		]);

		// create sample metadata
		//
		$data = [
			'image' => file_get_contents($file->rootPath()),
			'model' => [
				'negative_prompt' => $negativePrompt,
				'cfg_scale' => $cfgScale,
				'samples' => $samples,
				'seed' => $seed,
				'steps' => $steps,
				'style_preset' => $stylePreset
			]
		];

		// get artist
		//
		$user = User::current();
		$artist = $user->getFullName();

		// get model
		//
		$model = '';
		$count = 0;
		foreach ($data['model'] as $key => $value) {
			$model .= $key . ':' . $value;
			$count++;
			if ($count < count($data['model'])) {
				$model .= '; ';
			}
		}

		// compose metadata
		//
		$flags = '';
		$flags .= '-Description="' . $prompt . '" ';
		$flags .= '-Artist="' . $artist . '" ';
		$flags .= '-Model="' . $model . '" ';

		$executable = base_path('') . '/' . config('app.exif_tool_path');
		$command = $executable . ' -overwrite_original ' . $flags . ' ' . ' "' . $file->rootPath() . '"';
		exec($command, $output, $resultCode);

		// return info
		//
		return $file;
	});
});