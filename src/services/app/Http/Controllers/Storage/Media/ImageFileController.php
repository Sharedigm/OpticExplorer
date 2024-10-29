<?php
/******************************************************************************\
|                                                                              |
|                            ImageFileController.php                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for file system image file information.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Storage\Media;

use Illuminate\Http\Request;
use App\Models\Storage\Directory;
use App\Models\Storage\Media\ImageFile;
use App\Models\Users\User;
use App\Http\Controllers\Controller;

class ImageFileController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get an image file's contents.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getImage(Request $request) {
		
		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse image params
		//
		$width = $request->input('width');
		$height = $request->input('height');
		$minSize = $request->input('min_size');
		$maxSize = $request->input('max_size');

		// create image file
		//
		$file = new ImageFile([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// get file extension
		//
		$extension = $file->getExtension();
		$responseType = ImageFile::getResponseType($extension);

		// find if we are resizing or reformatting the image
		//
		$isRaster = $responseType != 'svg';
		$resize = ($width || $height || $minSize || $maxSize) && $isRaster;
		$reformat = (strtolower($extension) != $responseType) && $isRaster;

		if ($resize || $reformat) {
			return $file->readImage($width, $height, $minSize, $maxSize)->response($responseType);
		} else {
			return $file->response($responseType);
		}
	}

	/**
	 * Get an image file's resolution.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function getResolution(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create image file
		//
		$file = new ImageFile([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// query image
		//
		return $file->resolution;
	}

	/**
	 * Get an image file's exif information.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function getExif(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create image file
		//
		$file = new ImageFile([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// query image
		//
		return $file->readExifTool();
	}
}