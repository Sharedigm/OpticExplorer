<?php
/******************************************************************************\
|                                                                              |
|                           ArchiveFileController.php                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for handling archive (compressed) files.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Storage\Archives;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Models\Storage\Archives\ZipArchiveFile;
use App\Models\Storage\Archives\TarArchiveFile;
use App\Http\Controllers\Controller;

class ArchiveFileController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Extract an archive file to the file system.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return void
	 */
	public function postExtract(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create file
		//
		$extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
		if ($extension == 'tar') {
			$file = new TarArchiveFile([
				'path' => $path,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId
			]);
		} else {
			$file = new ZipArchiveFile([
				'path' => $path,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId
			]);
		}

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// extract archive
		//
		$value = $file->extractTo(null, '__MACOS');

		// check for errors
		//
		if ($value == false) {
			return response("Error extracting file.", 500);
		}		

		return;
	}

	//
	// querying methods
	//

	/**
	 * Get the contents of the top level directory of an archive file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Item[]
	 */
	public function getContents(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse archive params
		//
		$dirname = $request->input('dirname');
		$filter = $request->input('filter');

		// create file
		//
		$extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
		if ($extension == 'tar') {
			$file = new TarArchiveFile([
				'path' => $path,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId
			]);
		} else {
			$file = new ZipArchiveFile([
				'path' => $path,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId
			]);
		}

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		return $file->getContents($dirname, $filter, '__MACOSX', false);
	}

	/**
	 * Recursively get the complete contents of an archive file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Item[]
	 */
	public function getAllContents(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse archive params
		//
		$dirname = $request->input('dirname');
		$filter = $request->input('filter');

		// create file
		//
		$extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
		if ($extension == 'tar') {
			$file = new TarArchiveFile([
				'path' => $path,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId
			]);
		} else {
			$file = new ZipArchiveFile([
				'path' => $path,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId
			]);
		}

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		return $file->getContents($dirname, $filter, '__MACOSX', true);
	}
}