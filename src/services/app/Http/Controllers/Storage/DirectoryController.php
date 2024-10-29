<?php
/******************************************************************************\
|                                                                              |
|                            DirectoryController.php                           |
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
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use App\Models\Storage\Directory;
use App\Models\Storage\File;
use App\Models\Storage\Sharing\Link;
use App\Models\Users\User;
use App\Models\Places\Place;
use App\Models\Places\ItemPlace;
use App\Http\Controllers\Controller;
use App\Http\Filters\ItemFilters;
use App\Http\Filters\ImageFilters;
use App\Http\Filters\SharingFilters;
use App\Http\Filters\ContentFilter;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Storage\Permissions;
use App\Utilities\Uuids\Guid;

class DirectoryController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Create a new directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function postCreate(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		$permissions = $request->input('permissions');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		$parent = $directory->getParent();
		if (!$parent->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to create this directory.", 400);
		}

		// make new directory in storage
		//
		if (!$directory->make()) {
			return response("Could not create this directory.", 500);
		}

		// if permissions are not specified, use permissions of parent
		//
		if (!$permissions || $permissions == '') {
			$permissions = $parent->permissions;
		}

		// apply permissions to directory
		//
		$directory->setPermissions($permissions);

		// return new directory
		//
		return $directory;
	}

	//
	// compression methods
	//

	/**
	 * Compress a directory to an archive file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function postCompress(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// create zip file
		//
		$file = new File([
			'path' => rtrim($path, '/') . '.zip',
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// compress directory to zip file
		//
		$directory->compressTo($file->rootPath());

		// return new zip file
		//
		return $file;
	}

	//
	// geolocating methods
	//

	/**
	 * Set the place of a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function postPlace(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$name = $request->input('name');
		$description = $request->input('description');
		$latitude = $request->input('latitude');
		$longitude = $request->input('longitude');
		$zoomLevel = $request->input('zoom_level');

		// create place
		//
		$place = new Place([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'name' => $name,
			'description' => $description,
			'latitude' => $latitude,
			'longitude' => $longitude,
			'zoom_level' => $zoomLevel
		]);
		$place->save();

		// create item place
		//
		$itemPlace = new ItemPlace([
			'id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'path' => $path,
			'place_id' => $place->id
		]);
		$itemPlace->save();

		return $place;
	}

	//
	// querying methods
	//

	/**
	 * Get a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function getByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		// add directory attributes
		//
		$directory->append($directory->appendables);

		return $directory;
	}

	/**
	 * Get a directory's size.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getSize(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to read this directory.", 400);
		}

		return $directory->getSize();
	}

	//
	// file querying methods
	//

	/**
	 * Get the number files contained in the top level of a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getNumFiles(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		return count($this->getFiles());
	}


	/**
	 * Recursively get the number of all of the files contained in a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getNumAllFiles(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		$contents = $this->getAllFiles($request);

		// filter and return contents
		//
		$contents = ItemFilters::filter($request, $contents);
		$contents = ImageFilters::filter($request, $contents);
		$contents = SharingFilters::filter($request, $contents);

		return count($contents);
	}

	/**
	 * Get the files contained in the top level of a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getFiles(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		$files = $directory->getFiles();

		// filter and return contents
		//
		$files = ItemFilters::filter($request, $files);
		$files = ImageFilters::filter($request, $files);
		$files = SharingFilters::filter($request, $files);

		return $files;
	}

	/**
	 * Recursively get all of the files contained in a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getAllFiles(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		$files = $directory->getFiles(true);

		// filter and return contents
		//
		$files = ItemFilters::filter($request, $files);
		$files = ImageFilters::filter($request, $files);
		$files = SharingFilters::filter($request, $files);

		return $files;
	}

	//
	// directory querying methods
	//

	/**
	 * Get the number of directories contained in the top level of a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getNumDirectories(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		return count($this->getDirectories($request));
	}

	/**
	 * Recursively get number of all of the directories contained in a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getNumAllDirectories(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		return count($this->getAllDirectories($request));
	}

	/**
	 * Get the directories contained in the top level of a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getDirectories(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		$directories = $directory->getDirectories();

		// filter and return contents
		//
		$directories = ItemFilters::filter($request, $directories);
		$directories = ImageFilters::filter($request, $directories);
		$directories = SharingFilters::filter($request, $directories);

		return $directories;
	}

	/**
	 * Recursively get all of the directories contained in a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getAllDirectories(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		$directories = $directory->getDirectories(true);

		// filter and return contents
		//
		$directories = ItemFilters::filter($request, $directories);
		$directories = ImageFilters::filter($request, $directories);
		$directories = SharingFilters::filter($request, $directories);

		return $directories;	
	}

	//
	// file and directory querying methods
	//

	/**
	 * Get number of the items contained in the top level of a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getNumItems(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		return count($this->getItems($request));
	}

	/**
	 * Recursively get number of all of the items contained in a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return int
	 */
	public function getNumAllItems(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
		}

		return count($this->getAllItems($request));
	}

	/**
	 * Get all of the items contained in the top level of a directory.
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
		$details = $request->input('details');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);
				
		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to explore this directory.", 400);
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

		if ($request->has('shared-by')) {

			// get directory contents
			//
			$contents = $directory->getSharedItems($recursive);
		} else if ($volume) {

			// get volume directory contents
			//
			$contents = $directory->getItems($recursive);
		} else {

			// get directory and shared contents
			//
			$contents = $directory->getItems($recursive)->merge(
				$directory->getSharedItems($recursive));
		}

		// filter and return contents
		//
		$contents = ItemFilters::filter($request, $contents);
		$contents = ImageFilters::filter($request, $contents);
		$contents = SharingFilters::filter($request, $contents);
		$contents = ContentFilter::filter($request, $contents);

		// append attributes
		//
		if ($details) {
			$details = explode(',', $details);
			foreach ($details as $detail) {
				foreach ($contents as $item) {
					$item->append($detail);
					if ($detail == 'size' && $item instanceof Directory) {
						$item->append('num_files');
						$item->append('num_directories');
					}
					if ($detail == 'place' && $item instanceof File) {
						$item->append('exif');	
					}
				}
			}
		}

		return $contents;
	}

	/**
	 * Recursively get all of the items contained in a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Collection
	 */
	public function getAllItems(Request $request) {

		// get contents recursively
		//
		return $this->getItems($request, true);
	}

	//
	// updating methods
	//

	/**
	 * Update a directory's permissions.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function updateByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse permissions params
		//
		$permissions = $request->input('permissions');
		$recursive = $request->input('recursive');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (PermissionController::getGroup($request) != 'owner') {
			return response("You do not have permissions to change this directory.", 400);
		}

		// update permissions
		//
		if ($permissions) {
			$directory->setPermissions($permissions, $recursive);
		}

		return $directory;
	}
	
	/**
	 * Move a directory to a new destination.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function moveTo(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$dest = $request->input('dest');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directories
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to move this directory.", 400);
		}

		// move directory
		//
		if (!$directory->moveTo($dest)) {
			return response("Could not move this directory.", 500);
		}

		// return moved directory
		//
		return new Directory([
			'path' => $dest,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);
	}

	/**
	 * Copy a directory to a new destination.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function copyTo(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse copy params
		//
		$dest = $request->input('dest');
		$replace = $request->input('replace');

		// create directories
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to copy this directory.", 400);
		}

		// if replacing, then remove existing directory
		//
		if ($replace) {
			$existing = new Directory([
				'path' => $dest,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId	
			]);
			if ($existing->exists()) {
				$existing->delete();
			}
		}

		// copy directory
		//
		if (!$directory->copyTo($dest)) {
			return response("Could not copy this directory.", 500);
		}

		// return copied directory
		//
		$copy = new Directory([
			'path' => $dest,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// create parent
		//
		$parent = new File([
			'path' => dirname($dest) . '/',
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId	
		]);

		// apply read and write permissions of parent
		//
		if ($linkId || $shareId) {

			// create parent
			//
			$parent = new File([
				'path' => dirname($dest) . '/',
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId	
			]);

			$copy->setPermissions($parent->permissions, true);
		}

		return $copy;
	}

	/**
	 * Transfer a directory to a new destination belonging to another owner.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function transferTo(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$shareId = $request->input('share_id');
		$publicId = $request->input('public_id');

		// parse transfer params
		//
		$dest = $request->input('dest');
		$destVolume = $request->input('dest_volume');
		$destShareId = $request->input('dest_share_id');
		$destPublicId = $request->input('dest_public_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'share_id' => $shareId,
			'public_id' => $publicId
		]);
		$destDirectory = new Directory([
			'path' => $dest,
			'volume' => $destVolume,
			'share_id' => $destShareId,
			'public_id' => $destPublicId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to transfer this directory.", 400);
		}

		// transfer directory
		//
		if (!$directory->transferTo($destDirectory->getOwner(), $destDirectory->ownerPath())) {
			return response("Could not transfer this directory.", 500);
		}
		
		// return transferred directory
		//
		return new Directory([
			'path' => $dest,
			'volume' => $destVolume
		]);
	}

	/**
	 * Copy a directory to a new destination belonging to another owner.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function duplicateTo(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$shareId = $request->input('share_id');
		$publicId = $request->input('public_id');

		// parse duplicate params
		//
		$dest = $request->input('dest');
		$destVolume = $request->input('dest_volume');
		$destShareId = $request->input('dest_share_id');
		$destPublicId = $request->input('dest_public_id');

		// create file
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'share_id' => $shareId,
			'public_id' => $publicId
		]);
		$destDirectory = new Directory([
			'path' => $dest,
			'volume' => $destVolume,
			'share_id' => $destShareId,
			'public_id' => $destPublicId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to duplicate this directory.", 400);
		}

		// duplicate directory
		//
		if (!$directory->duplicateTo($destDirectory->getOwner(), $destDirectory->ownerPath())) {
			return response("Could not duplicate this directory.", 500); 
		}

		// return duplicated directory
		//
		$duplicate = new Directory([
			'path' => $dest,
			'volume' => $destVolume
		]);

		// apply read and write permissions of parent
		//
		if ($destShareId || $destPublicId) {

			// create parent
			//
			$parent = new File([
				'path' => dirname($dest) . '/',
				'volume' => $destVolume,
				'share_id' => $destShareId,
				'public_id' => $destPublicId
			]);

			$duplicate->setPermissions($parent->permissions, true);
		}

		return $duplicate;
	}

	/**
	 * Delete a directory's contents.
	 *
	 * @return App\Models\Storage\Directory
	 */
	public function clear(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to clear this directory.", 400);
		}

		// clear directory
		//
		if (!$directory->clear()) {
			return response("Could not clear this directory.", 500);
		}

		// return cleared directory
		//
		return $directory;
	}

	//
	// downloading methods
	//

	/**
	 * Download a directory as an archive file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function download(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		
		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to download this directory.", 400);
		}

		// compress to file in user's temporary folder
		//
		$dest = FileStorage::temp() . '/' . basename($path) . '.zip';

		// compress directory to destination and download
		//
		$directory->compressTo($dest);

		// return compressed file
		//
		return response()->download($dest);
	}

	//
	// sharing methods
	//

	/**
	 * Send a directory via email.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return bool | Illuminate\Support\Facades\Response
	 */
	public function sendMail(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to email this directory.", 400);
		}

		// get mail parameters
		//
		$user = User::current();
		$to = $request->input('to');
		$cc = $request->input('cc');
		$subject = $request->input('subject');
		$senderMessage = $request->input('message');
		$url = $request->input('url');

		// check mail parameters
		//
		if (!$to || sizeof($to) < 1) {
			return response("Must have at least one recipient.", 400);
		} else if (!$subject) {
			return response("Missing subject field.", 400);
		} else if (!$user) {
			return response("No session.", 401);
		}

		// return error if email is not enabled
		//
		if (!config('mail.enabled')) {
			return response("Email has not been enabled.", 400);
		}

		if ($url) {
			Mail::send('emails.share-folder-by-email-link', [
				'sender' => $user->getFullName(),
				'url' => $url,
				'senderMessage' => $senderMessage,
				'app_name' => config('app.name'),
				'client_url' => config('app.client_url')
			], function($message) use ($user, $to, $cc, $subject, $url) {
				$message->to($to);
				if ($cc) {
					$message->cc($cc);
				}
				$message->subject($subject);
			});
		} else {
			Mail::send('emails.share-folder-by-email-attachment', [
				'sender' => $user->getFullName(),
				'senderMessage' => $senderMessage,
				'app_name' => config('app.name'),
				'client_url' => config('app.client_url')
			], function($message) use ($user, $to, $cc, $subject, $directory) {
				$message->to($to);
				if ($cc) {
					$message->cc($cc);
				}
				$message->subject($subject);

				// compress directory to destination and attach
				//
				$dest = FileStorage::temp() . '/' . basename($directory->path) . '.zip';
				$directory->compressTo($dest);
				$message->attach($dest);
			});
		}
	}

	//
	// deleting methods
	//

	/**
	 * Delete a directory's place.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function deletePlace(Request $request) {

		// parse params
		//
		$path = $request->input('path');

		// look up item place
		//
		$itemPlace = ItemPlace::where('user_id', '=', Session::get('user_id'))
			->where('path', '=', $path)->get()[0];
		$place = Place::find($itemPlace->place_id);

		// delete item place and place
		//
		$itemPlace->delete();
		$place->delete();

		// return file
		//
		return $itemPlace;
	}

	/**
	 * Delete a directory.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\Directory
	 */
	public function delete(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		
		// create directory
		//
		$directory = new Directory([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check if directory exists
		//
		if (!$directory->exists()) {
			return response("Directory '" . $directory->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$directory->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to delete this directory.", 400);
		}

		// delete directory
		//
		if (!$directory->delete()) {
			return response("Could not delete this directory.", 500);
		}

		// return deleted directory
		//
		return $directory;
	}
}