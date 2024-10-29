<?php
/******************************************************************************\
|                                                                              |
|                                  storage.php                                 |
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
use App\Http\Controllers\Storage\FileController;
use App\Http\Controllers\Storage\DirectoryController;
use App\Http\Controllers\Storage\VolumeController;
use App\Http\Controllers\Storage\FileIndexController;
use App\Http\Controllers\Storage\Archives\ArchiveFileController;
use App\Http\Controllers\Storage\Attachments\AttachmentController;
use App\Http\Controllers\Users\Storage\UserStorageController;

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
// public routes
//

Route::get('files/search', [FileIndexController::class, 'getSearch']);
Route::get('files/search/num', [FileIndexController::class, 'getSearchNum']);
Route::get('storage/exists', [VolumeController::class, 'getExists']);

//
// protected routes
//

Route::group(['middleware' => 'verify.storage_access'], function() {
	
	// file routes
	//
	Route::post('file/upload', [FileController::class, 'postUpload']);
	Route::post('file/compress', [FileController::class, 'postCompress']);
	Route::get('file', [FileController::class, 'getByPath']);
	Route::get('file/read', [FileController::class, 'getReadByPath']);
	Route::post('file/write', [FileController::class, 'postWriteByPath']);
	Route::put('file/update', [FileController::class, 'putUpdateByPath']);
	Route::put('file', [FileController::class, 'updateByPath']);
	Route::put('file/move', [FileController::class, 'moveTo']);
	Route::post('file/copy', [FileController::class, 'copyTo']);
	Route::put('file/transfer', [FileController::class, 'transferTo']);
	Route::post('file/duplicate', [FileController::class, 'duplicateTo']);
	Route::get('file/thumb', [FileController::class, 'getThumbnail']);
	Route::get('file/download', [FileController::class, 'download']);
	Route::post('file/mail', [FileController::class, 'sendMail']);
	Route::post('file/place', [FileController::class, 'postPlace']);
	Route::delete('file/place', [FileController::class, 'deletePlace']);
	Route::delete('file', [FileController::class, 'delete']);

	// directory routes
	//
	Route::post('directory', [DirectoryController::class, 'postCreate']);
	Route::post('directory/compress', [DirectoryController::class, 'postCompress']);
	Route::get('directory', [DirectoryController::class, 'getByPath']);
	Route::get('directory/size', [DirectoryController::class, 'getSizeByPath']);
	Route::put('directory', [DirectoryController::class, 'updateByPath']);
	Route::put('directory/move', [DirectoryController::class, 'moveTo']);
	Route::post('directory/copy', [DirectoryController::class, 'copyTo']);
	Route::put('directory/transfer', [DirectoryController::class, 'transferTo']);
	Route::post('directory/duplicate', [DirectoryController::class, 'duplicateTo']);
	Route::post('directory/clear', [DirectoryController::class, 'clear']);
	Route::get('directory/download', [DirectoryController::class, 'download']);
	Route::post('directory/mail', [DirectoryController::class, 'sendMail']);
	Route::post('directory/place', [DirectoryController::class, 'postPlace']);
	Route::delete('directory/place', [DirectoryController::class, 'deletePlace']);
	Route::delete('directory', [DirectoryController::class, 'delete']);

	// directory exploration routes
	//
	Route::get('directory/files', [DirectoryController::class, 'getFiles']);
	Route::get('directory/files/num', [DirectoryController::class, 'getNumFiles']);
	Route::get('directory/files/all', [DirectoryController::class, 'getAllFiles']);
	Route::get('directory/files/all/num', [DirectoryController::class, 'getNumAllFiles']);

	Route::get('directory/directories', [DirectoryController::class, 'getDirectories']);
	Route::get('directory/directories/num', [DirectoryController::class, 'getNumDirectories']);
	Route::get('directory/directories/all', [DirectoryController::class, 'getAllDirectories']);
	Route::get('directory/directories/all/num', [DirectoryController::class, 'getNumAllDirectories']);

	Route::get('directory/contents', [DirectoryController::class, 'getItems']);
	Route::get('directory/contents/num', [DirectoryController::class, 'getNumItems']);
	Route::get('directory/contents/all', [DirectoryController::class, 'getAllItems']);
	Route::get('directory/contents/all/num', [DirectoryController::class, 'getNumAllItems']);

	// volume routes
	//
	Route::post('volume/upload', [FileController::class, 'postUpload']);
	Route::post('volume/compress', [FileController::class, 'postCompress']);
	Route::get('volume', [DirectoryController::class, 'getByPath']);
	Route::get('volume/contents', [VolumeController::class, 'getItems']);
	Route::get('volume/read', [FileController::class, 'getReadByPath']);
	Route::post('volume/write', [FileController::class, 'postWriteByPath']);
	Route::put('volume/update', [FileController::class, 'putUpdateByPath']);
	Route::put('volume', [FileController::class, 'updateByPath']);
	Route::put('volume/move', [FileController::class, 'moveTo']);
	Route::post('volume/copy', [FileController::class, 'copyTo']);
	Route::put('volume/transfer', [FileController::class, 'transferTo']);
	Route::post('volume/duplicate', [FileController::class, 'duplicateTo']);
	Route::get('volume/thumb', [FileController::class, 'getThumbnail']);
	Route::get('volume/download', [FileController::class, 'download']);
	Route::post('volume/mail', [FileController::class, 'sendMail']);
	Route::post('volume/place', [FileController::class, 'postPlace']);
	Route::delete('volume', [FileController::class, 'delete']);

	// archive file routes
	//
	Route::post('archive/extract', [ArchiveFileController::class, 'postExtract']);
	Route::get('archive/contents', [ArchiveFileController::class, 'getContents']);
	Route::get('archive/contents/all', [ArchiveFileController::class, 'getAllContents']);

	// attachment routes
	//
	Route::get('attachments', [AttachmentController::class, 'getByPath']);
	Route::get('attachments/num', [AttachmentController::class, 'getNumByPath']);
	Route::get('attachments/invalid', [AttachmentController::class, 'getInvalid']);
	Route::get('attachments/clean', [AttachmentController::class, 'getClean']);

	// indexing routes
	//
	Route::get('directory/files/indexed', [FileIndexController::class, 'getIndexed']);
	Route::get('directory/files/indexed/num', [FileIndexController::class, 'getNumIndexed']);
	Route::get('directory/files/indexed/all', [FileIndexController::class, 'getAllIndexed']);
	Route::get('directory/files/indexed/all/num', [FileIndexController::class, 'getNumAllIndexed']);

	Route::get('directory/files/indexable', [FileIndexController::class, 'getIndexable']);
	Route::get('directory/files/indexable/num', [FileIndexController::class, 'getNumIndexable']);
	Route::get('directory/files/indexable/all', [FileIndexController::class, 'getAllIndexable']);
	Route::get('directory/files/indexable/all/num', [FileIndexController::class, 'getNumAllIndexable']);

	Route::post('file/index', [FileIndexController::class, 'postCreate']);
	Route::delete('file/indices/{id}', [FileIndexController::class, 'deleteIndex']);
	Route::delete('directory/indices', [FileIndexController::class, 'deleteIndices']);

	// user storage
	//
	Route::get('storage', [UserStorageController::class, 'getCurrent']);
	Route::put('storage/{id}', [UserStorageController::class, 'updateIndex']);
});