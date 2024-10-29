<?php
/******************************************************************************\
|                                                                              |
|                                   media.php                                  |
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
use App\Http\Controllers\Storage\Media\AudioFileController;
use App\Http\Controllers\Storage\Media\ImageFileController;
use App\Http\Controllers\Storage\Media\PdfFileController;
use App\Http\Controllers\Storage\Media\VideoFileController;

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
// protected routes
//

Route::group(['middleware' => 'verify.storage_access'], function() {

	// audio file routes
	//
	Route::get('audio', [AudioFileController::class, 'getAudio']);
	Route::get('audio/id3', [AudioFileController::class, 'getId3']);

	// image file routes
	//
	Route::post('image', [ImageFileController::class, 'postGenerate']);
	Route::post('image/enhance', [ImageFileController::class, 'postEnhance']);
	Route::get('image', [ImageFileController::class, 'getImage']);
	Route::get('image/resolution', [ImageFileController::class, 'getResolution']);
	Route::get('image/exif', [ImageFileController::class, 'getExif']);

	// pdf file routes
	//
	Route::get('pdf/text', [PdfFileController::class, 'getText']);

	// video file routes
	//
	Route::get('video', [VideoFileController::class, 'getVideo']);
	Route::get('video/tags', [VideoFileController::class, 'getTags']);
	Route::get('video/exif', [VideoFileController::class, 'getExif']);
});