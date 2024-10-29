<?php
/******************************************************************************\
|                                                                              |
|                               FileController.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a controller for file system file information.                |
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
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Mail;
use App\Models\Storage\File;
use App\Models\Storage\Directory;
use App\Models\Storage\Sharing\Link;
use App\Models\Users\User;
use App\Models\Places\Place;
use App\Models\Places\ItemPlace;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Storage\PermissionController;
use App\Utilities\Storage\Permissions;
use App\Utilities\Strings\StringUtils;
use App\Utilities\Uuids\Guid;

class FileController extends Controller
{
	//
	// creating methods
	//

	/**
	 * Upload a new file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function postUpload(Request $request) {

		// parse params
		//
		$file = $request->file('file');
		$name = $request->input('name');
		$permissions = $request->input('permissions');

		// parse dest params
		//
		$dest = $request->input('dest');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// check directory permissions
		//
		$parent = new Directory([
			'path' => $dest,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (!$parent->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to write to " . 
				($dest? "the directory '" . $dest . "'." : "this directory."), 400);
		}

		// check available space
		//
		$owner = $parent->getOwner();
		if ($owner->account->disk_quota) {
			$usage = Directory::sizeToUnits($owner->account->disk_usage, 'K');
			$quota = Directory::sizeToUnits($owner->account->disk_quota, 'K');
			if ($usage > $quota) {
				return response("Out of space.  You will need to delete some items to upload additional files.", 400);
			}
		}

		if (!$file) {
			return response("No file specified.", 500);
		}

		$filename = $name? $name : $file->getClientOriginalName();
		$path = $dest? $dest . $filename : $filename;

		// create new file
		//
		$item = Directory::createFile([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// delete existing item, if one exists
		//
		if ($item->exists()) {
			$copy = $item->replicate();
			$copy->delete();
		}

		// upload file to storage
		//
		if (!$file->storeAs(dirname($item->fullPath()), $filename, [
			'visibility' => 'private',
			'Metadata' => $item->getNewMetadata($file)
		])) {
			return response($file->getErrorMessage(), 500);
		};

		// if permissions are not specified, use permissions of parent
		//
		if (!$permissions || $permissions == '') {
			$permissions = $parent->permissions;
		}

		// apply permissions to file
		//
		$item->setPermissions($permissions);

		return $item;
	}

	/**
	 * Compress a file, creating a new archive file.
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

		// create file
		//
		$file = new File([
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

		// compress file to destination
		//
		$file->compressTo($file->rootPath() . '.zip');

		// return compressed file
		//
		return new File([
			'path' => $path . '.zip',
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);
	}

	//
	// geolocating methods
	//

	/**
	 * Set the place of a file.
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
	 * Get a file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function getByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		$details = $request->input('details');

		// create file
		//
		$file = Directory::createFile([
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

		// add file attributes
		//
		$file->append($file->appendables);
		if ($details) {
			$item->append($details);
		}

		return $file;
	}

	/**
	 * Read a file's contents.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return string
	 */
	public function getReadByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create file
		//
		$file = new File([
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

		return $file->readContents();
	}

	/**
	 * Write a file's contents.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function postWriteByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse content param
		//
		$contents = $request->input('contents');

		// create file
		//
		$file = new File([
			'path' => $path,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);

		// check permissions
		//
		if (PermissionController::getGroup($request) != 'owner') {
			return response("You do not have permissions to change this file.", 400);
		}

		$file->writeContents($contents);
		return $file;
	}

	/**
	 * Update a file's contents.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function putUpdateByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse content param
		//
		$contents = $request->input('contents');

		// create file
		//
		$file = new File([
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

		// check permissions
		//
		if (!$file->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to change this file.", 400);
		}

		$file->updateContents($contents);
		return $file;
	}

	//
	// querying methods
	//

	/**
	 * Get a file's thumbnail image.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function getThumbnail(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse thumbnail params
		//
		$minSize = $request->input('min_size');
		$maxSize = $request->input('max_size');

		// create file
		//
		$file = Directory::createFile([
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

		// return / resize image
		//
		return $file->getThumbnail($minSize, $maxSize);
	}

	//
	// updating methods
	//

	/**
	 * Update a file's permissions.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function updateByPath(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// parse permissions param
		//
		$permissions = $request->input('permissions');

		// create file
		//
		$file = new File([
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

		// check permissions
		//
		if (!$file->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to change this file.", 400);
		}

		$file->setPermissions($permissions);
		return $file;
	}

	/**
	 * Move a file to a new destination.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function moveTo(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$dest = $request->input('dest');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create files
		//
		$file = new File([
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

		// check permissions
		//
		if (!$file->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to move this file.", 400);
		}
		if (StringUtils::startsWith($path, '/')) {
			return response("You do not have permissions to move from this directory.", 400);
		}
		if (StringUtils::startsWith($dest, '/')) {
			return response("You do not have permissions to write to this directory.", 400);
		}

		// move file
		//
		if (!$file->moveTo($dest)) {
			return response("Could not move this file.", 500);
		}

		// return moved file
		//
		return new File([
			'path' => $dest,
			'volume' => $volume,
			'link_id' => $linkId,
			'share_id' => $shareId
		]);
	}

	/**
	 * Copy a file to a new destination.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
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
		
		// create files
		//
		$file = new File([
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

		// check permissions
		//
		if (!$file->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to copy this file.", 400);
		}
		if (StringUtils::startsWith($dest, '/')) {
			return response("You do not have permissions to write to this directory.", 400);
		}

		// if replacing, then remove existing file
		//
		if ($replace) {
			$existing = new File([
				'path' => $dest,
				'volume' => $volume,
				'link_id' => $linkId,
				'share_id' => $shareId	
			]);
			if ($existing->exists()) {
				$existing->delete();
			}
		}

		// copy file
		//
		if (!$file->copyTo($dest)) {
			return response("Could not copy this file.", 500);
		}

		// return copied file
		//
		$copy = new File([
			'path' => $dest,
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

			$copy->setPermissions($parent->permissions);
		}

		return $copy;
	}

	/**
	 * Transfer a file to a new destination belonging to another owner.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
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

		// create file
		//
		$file = new File([
			'path' => $path,
			'volume' => $volume,
			'share_id' => $shareId,
			'public_id' => $publicId
		]);
		$destFile = new File([
			'path' => $dest,
			'volume' => $destVolume,
			'share_id' => $destShareId,
			'public_id' => $destPublicId
		]);

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$file->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to move this file.", 400);
		}

		// transfer file
		//
		if (!$file->transferTo($destFile->getOwner(), $destFile->ownerPath())) {
			return response("Could not transfer this file.", 500);
		}

		// return transfered file
		//
		return new File([
			'path' => $dest,
			'volume' => $destVolume
		]);
	}

	/**
	 * Copy a directory to a new destination belonging to another owner.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function duplicateTo(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$shareId = $request->input('share_id');
		$publicId = $request->input('public_id');

		// parse dupliate params
		//
		$dest = $request->input('dest');
		$destVolume = $request->input('dest_volume');
		$destShareId = $request->input('dest_share_id');
		$destPublicId = $request->input('dest_public_id');

		// create file
		//
		$file = new File([
			'path' => $path,
			'volume' => $volume,
			'share_id' => $shareId,
			'public_id' => $publicId
		]);
		$destFile = new File([
			'path' => $dest,
			'volume' => $destVolume,
			'share_id' => $destShareId,
			'public_id' => $destPublicId
		]);

		// check if file exists
		//
		if (!$file->exists()) {
			return response("File '" . $file->getPath() . "' not found.", 404);
		}

		// check permissions
		//
		if (!$file->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to duplicate this file.", 400);
		}

		// duplicate file
		//
		if (!$file->duplicateTo($destFile->getOwner(), $destFile->ownerPath())) {
			return response("Could not duplicate this file.", 500);
		}

		// return duplicated file
		//
		$duplicate = new File([
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

			$duplicate->setPermissions($parent->permissions);
		}

		return $duplicate;
	}

	//
	// downloading methods
	//

	/**
	 * Download a file.
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
		
		// create file
		//
		$file = new File([
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

		// check permissions
		//
		if (!$file->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to download this file.", 400);
		}

		// return downloaded file
		//
		return $file->download();
	}

	//
	// sharing methods
	//

	/**
	 * Send a file via email.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return Illuminate\Support\Facades\Response
	 */
	public function sendMail(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');

		// create file
		//
		$file = new File([
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

		// check permissions
		//
		if (!$file->isReadableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to email this file.", 400);
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
			Mail::send('emails.share-file-by-email-link', [
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
			Mail::send('emails.share-file-by-email-attachment', [
				'sender' => $user->getFullName(),
				'senderMessage' => $senderMessage,
				'app_name' => config('app.name'),
				'client_url' => config('app.client_url')
			], function($message) use ($user, $to, $cc, $subject, $file) {
				$message->to($to);
				if ($cc) {
					$message->cc($cc);
				}
				$message->subject($subject);
				$message->attach($file->rootPath());
			});
		}
	}

	//
	// deleting methods
	//

	/**
	 * Delete a file's place.
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
	 * Delete a file.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return App\Models\Storage\File
	 */
	public function delete(Request $request) {

		// parse params
		//
		$path = $request->input('path');
		$volume = $request->input('volume');
		$linkId = $request->input('link_id');
		$shareId = $request->input('share_id');
		
		// create file
		//
		$file = new File([
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
		
		// check permissions
		//
		if (!$file->isWritableBy(PermissionController::getGroup($request))) {
			return response("You do not have permissions to delete this file.", 400);
		}

		// delete thumbnails, if they exist
		//
		$file->deleteThumbnails();
		
		// delete file
		//
		if (!$file->delete()) {
			return response("Could not delete this file.", 500);
		}

		// return deleted file
		//
		return $file;
	}
}