<?php
/******************************************************************************\
|                                                                              |
|                             VolumeController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for file system directory information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Controllers\Storage;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Models\Storage\Volume;
use App\Models\Storage\Sharing\Link;
use App\Http\Controllers\Controller;
use App\Http\Filters\ItemFilters;
use App\Http\Filters\ImageFilters;
use App\Http\Filters\SharingFilters;
use App\Utilities\Storage\Permissions;
use App\Utilities\Storage\S3Storage;

class VolumeController extends Controller
{
	//
	// getting methods
	//

	/**
	 * Get whether or not a volume exists.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getExists(Request $request, bool $recursive = false) {

		// parse params
		//
		$attributes = $request->all();

		// create s3 client
		//
		$client = S3Storage::getS3Client($attributes);

		// check if bucket exists
		//
		if (S3Storage::bucketExists($client, $attributes['bucket'])) {
			return response("Bucket was found.", 200);
		} else {
			return response("Bucket not found.", 404);
		}
	}

	/**
	 * Get all of the items contained in the top level of a volume.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getItems(Request $request, bool $recursive = false) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$volume = new Volume([
			'path' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if volume exists
		//
		if (!$volume->exists()) {
			return response("Volume '" . $volume->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$volume->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this volume.", 400);
		}

		// check link
		//
		if ($linkId) {
			$link = Link::find($linkId);

			// increment link count
			//
			if ($link) {
				$link->hits++;
				$link->save();
			}
		}
		
		// get volume contents
		//
		$contents = $volume->getItems($recursive);

		// filter and return contents
		//
		$contents = ItemFilters::filter($request, $contents);
		$contents = ImageFilters::filter($request, $contents);
		$contents = SharingFilters::filter($request, $contents);

		return $contents;
	}

	/**
	 * Recursively get all of the items contained in a volume.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getAllItems(Request $request) {

		// get contents recursively
		//
		return $this->getItems($request, true);
	}
}