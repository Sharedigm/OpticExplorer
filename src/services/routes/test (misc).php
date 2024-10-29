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
use Intervention\Image\Image;
use Spatie\PdfToText\Pdf;
use App\Models\Storage\File;
use App\Models\Users\User;
use App\Utilities\AI\OpenAI;
use App\Utilities\AI\Pinecone;
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

/*
Route::get('delete', function() {

	// find user by id
	//
	$user = User::find('751ac041-3a27-b5b2-6f4f-89111a0c3f37');
	if (!$user) {
		return response("User not found.", 404);
	}

	// check permissions
	//
	if (!$user->isWritableBy(User::current())) {
		return response("You do not have permission to delete this user.", 400);
	}

	// delete user from database and file system
	//
	$user->delete();

	return $user;
});
*/

Route::group(['middleware' => 'verify.storage_access'], function() {
	Route::get('test-dng', function() {
		$file = new File([
			'path' => 'Pictures/Photos/DJI_0016.DNG'
			// 'path' => 'Pictures/Photos/DSC_8578 (900x600).jpg'
		]);
		$image = \Image::make($file->rootPath());
		return $image->response('jpg');
	});
});

Route::get('test-pdf-thumbnail', function() {
	/*
	$image = \Image::make('/Users/tribble/Sites/user-data/sharedigm/amegahed/Documents/hypercosm-studio-users-guide.pdf');
	$image->setIteratorIndex(0);
	return $image->response('jpg');
	*/

	$imagick = new Imagick('/Users/tribble/Sites/user-data/sharedigm/amegahed/Documents/hypercosm-studio-users-guide.pdf[0]');
	$imagick->setIteratorIndex(0);
	$imagick->setImageFormat('jpg');
	$imagick->setImageCompressionQuality(0);
	$imagick->setImageBackgroundColor('#ffffff');
	$imagick->setImageAlphaChannel(Imagick::VIRTUALPIXELMETHOD_WHITE);
	$imagick->scaleImage(0, 50); 
	return response($imagick)->header(
		'Content-Type', 'image/jpg'
	);
});

Route::get('pdf-test', function(Request $request) {
	// Log::info("incoming request: " . print_r($request->all(), 1));

	// get text from file
	//
	$text = (new Pdf(config('app.pdftotext_path')))
		->setPdf('/Users/tribble/Sites/user-data/amegahed/Documents/github-cheat-sheet.pdf')
		->text();
	return $text;
});

Route::get('embedding', function(Request $request) {

	// get text from file
	//
	$text = (new Pdf(config('app.pdftotext_path')))
		->setPdf('/Users/tribble/Sites/user-data/amegahed/Documents/github-cheat-sheet.pdf')
		->text();

	// get vector from text
	//
	$vector = OpenAI::embed($text);

	return $vector;
});

Route::get('vectors', function(Request $request) {

	// get text from file
	//
	$text = (new Pdf(config('app.pdftotext_path')))
		->setPdf('/Users/tribble/Sites/user-data/amegahed/Documents/github-cheat-sheet.pdf')
		->text();

	$vector = OpenAI::embed($text);
});

//
// pinecone API test
//

Route::get('list-indices', function(Request $request) {
	return Pinecone::list();
});

Route::get('upsert', function(Request $request) {
	$user_id = 'd320edc7-851f-a9cf-6ef9-e61382bae051';
	$user_path = '/Users/tribble/Sites/user-data/amegahed';
	// $path = 'Documents/github-cheat-sheet.pdf';
	$path = 'Documents/On The Electrodynamics Of Moving Bodies.pdf';

	// get text from file
	//
	$text = (new Pdf(config('app.pdftotext_path')))
		->setPdf($user_path . '/' . $path)
		->text();

	// get vector from text
	//
	$values = OpenAI::embed($text);

	// insert into vector database
	//
	$result = Pinecone::upsert(Guid::create(), $values, [
		"path" => $path,
		"user_id" => $user_id
	]);

	return $result;
});

Route::get('find-file', function(Request $request) {
	$user_id = 'd320edc7-851f-a9cf-6ef9-e61382bae051';
	$user_path = '/Users/tribble/Sites/user-data/amegahed';
	$path = 'Documents/github-cheat-sheet.pdf';
	// $path = 'Documents/On The Electrodynamics Of Moving Bodies.pdf';

	// get text from file
	//
	$text = (new Pdf(config('app.pdftotext_path')))
		->setPdf($user_path . '/' . $path)
		->text();

	// lookup vector
	//
	$vector = OpenAI::embed($text);
	$topK = 10;
	$includeValues = false;
	$result = Pinecone::query($vector, $topK, $includeValues);

	return $result;
});

Route::get('remove-file', function(Request $request) {
	$result = Pinecone::remove([
		'8cb9d3b1-a709-506a-1bb8-af3ae2c329a6'
	]);

	return $result;
});


//
// pinecone interface tests
//

Route::get('pinecone-stats', function(Request $request) {
	$apiKey = config('services.pinecone.api_key');
	$environment = config('services.pinecone.environment');
	$pinecone = new Pinecone($apiKey, $environment);
	return $pinecone->index('index1')->vectors()->stats();
});

Route::get('pinecone-describe', function(Request $request) {
	$apiKey = config('services.pinecone.api_key');
	$environment = config('services.pinecone.environment');
	$pinecone = new Pinecone($apiKey, $environment);
	return $pinecone->index('index1')->describe();
});

Route::get('pinecone-query', function(Request $request) {
	$apiKey = config('services.pinecone.api_key');
	$environment = config('services.pinecone.environment');
	$pinecone = new Pinecone($apiKey, $environment);
	return $pinecone->index('index1')->vectors()->query(
		vector: [],
		topK: 1,
	);
});