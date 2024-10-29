<?php
/******************************************************************************\
|                                                                              |
|                             PdfFileController.php                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for file system PDF file information.            |
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
use App\Models\Storage\Media\PdfFile;
use App\Http\Controllers\Controller;

class PdfFileController extends Controller
{
	//
	// querying methods
	//

	/**
	 * Get a PDF file's contents.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getText(Request $request) {
		
		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$shareId = $request->input('share_id');
		$linkId = $request->input('link_id');

		// create audio file
		//
		$file = new PdfFile([
			'path' => $path,
			'volume' => $volume,
			'share_id' => $shareId,
			'link_id' => $linkId
		]);

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		return $file->toText();
	}
}