<?php
/******************************************************************************\
|                                                                              |
|                                FileStorage.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a file storage system.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Utilities\Storage;

use Illuminate\Support\Facades\Storage;
use App\Models\Users\Auth\UserSession;
use App\Models\Users\User;
use App\Models\Users\Storage\UserStorage;
use App\Models\Storage\Directory;

class FileStorage
{
	private static $stack = [];

	//
	// storage disk methods
	//

	/**
	 * Find if we are using the local file system.
	 *
	 * @return bool
	 */
	static function isLocal(): bool {
		return self::filesystem() == 'local';
	}

	/**
	 * Find the default file system.
	 *
	 * @return string
	 */
	static function filesystem() {
		return config('filesystems.default');
	}

	/**
	 * Get the root of the file system.
	 *
	 * @return string
	 */
	static function root(): string {
		if (self::isLocal()) {
			return Storage::disk('local')->path('');
		} else {
			return '';
		}
	}

	/**
	 * Get the file system temp directory path (for the current user).
	 *
	 * @return string
	 */
	static function temp(): string {
		// return sys_get_temp_dir();

		// create temp directory
		//
		$tempdir = self::root() . 'temp';
		if (!file_exists($tempdir)) {
			mkdir($tempdir);
		}

		return $tempdir;
	}

	//
	// storage context methods
	//

	/**
	 * Set user context.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param string $userAccount - the account of the user
	 * @return void
	 */
	public static function setUserContext($userAccount, $path = '') {

		// set user storage
		//
		$userStorage = UserStorage::where('user_id', '=', $userAccount->user_id)->first();
		if ($userStorage) {
			config([
				'filesystems.default' => 's3',
				'filesystems.disks.s3.endpoint' => 'https://' . $userStorage->host,
				'filesystems.disks.s3.key' => $userStorage->key,
				'filesystems.disks.s3.secret' => $userStorage->secret,
				'filesystems.disks.s3.region' => $userStorage->region ?? 'default',
				'filesystems.disks.s3.bucket' => $userStorage->bucket
			]);
		}

		// set user storage file path
		//
		if (!$userAccount->isAdmin() && !$userStorage) {
			self::push($userAccount->username . '/' . $path);
		} else {
			self::push($path);
		}
	}

	/**
	 * Get the current storage context.
	 *
	 * @return string
	 */
	static function home(): string {
		return self::root() . self::current();
	}

	/**
	 * Get the current storage context.
	 *
	 * @return string
	 */
	static function current(): string {
		return current(self::$stack);
	}

	/**
	 * Push the storage context.
	 *
	 * @param string $path - the storage context to push.
	 * @param bool $relative - whether the storage context is relative to the current storage context.
	 * @return void
	 */
	static function push(string $path, bool $relative = false) {

		// push new context
		//
		if ($relative) {
			array_push(self::$stack, self::get() . $path);
		} else {
			array_push(self::$stack, $path);
		}
	}

	/**
	 * Pop the storage context.
	 *
	 * @return string
	 */
	static function pop(): string {
		return array_pop(self::$stack);
	}

	//
	// user storage querying methods
	//

	/**
	 * Find if a user's item exists.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the item path to query.
	 * @return bool
	 */
	static function has(User $user, string $path): bool {
		return Storage::has(self::root() . '/' . $user->account->username . '/' . $path);
	}

	/**
	 * Find the size of a user's file.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the file path to query.
	 * @return int
	 */
	static function size(User $user, string $path): int {
		return Storage::size(self::root(). '/' . $user->account->username . '/' . $path);
	}

	/**
	 * Find the list of files in a user's directory.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the directory path to query.
	 * @return array
	 */
	static function files(User $user, string $path): array {
		return Storage::files(self::root(). '/' . $user->account->username . '/' . $path);
	}

	/**
	 * Find the list of directories in a user's directory.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the directory path to query.
	 * @return array
	 */
	static function directories(User $user, string $path): array {
		return Storage::directories(self::root(). '/' . $user->account->username . '/' . $path);
	}

	//
	// user storage methods
	//

	/**
	 * Make a user's directory.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the directory path to create.
	 * @return bool - success
	 */
	static function makeDirectory(User $user, string $path): bool {
		return Storage::makeDirectory($user->account->username . '/' . $path);
	}

	/**
	 * Read a user's file.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the path of the file to read.
	 * @return bool - success
	 */
	static function read(User $user, string $path) {
		return Storage::read($user->account->username . '/' . $path);
	}

	/**
	 * Write a user's file.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the path of the file to write.
	 * @param string $contents - the file contents to write.
	 * @return bool - success
	 */
	static function write(User $user, string $path, string $contents) {
		return Storage::write($user->account->username . '/' . $path, $contents);
	}

	/**
	 * Update a user's file.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the path of the file to update.
	 * @param string $contents - the file contents to write.
	 * @return bool - success
	 */
	static function update(User $user, string $path, string $contents) {
		return Storage::update($user->account->username . '/' . $path, $contents);
	}

	/**
	 * Move a user's file.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the path of the file to move.
	 * @param string $destPath - the path to move the file to.
	 * @return bool - success
	 */
	static function move(User $user, string $path, string $destPath) {
		return Storage::move($user->account->username . '/' . $path, $user->account->username . '/' . $destPath);
	}

	/**
	 * Copy a user's file.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the path of the file to copy.
	 * @param string $destPath - the path to copy the file to.
	 * @return bool - success
	 */
	static function copy(User $user, string $path, string $destPath) {
		return Storage::copy($user->account->username . '/' . $path, $user->account->username . '/' . $destPath);
	}

	/**
	 * Transfer a user's file to another user.
	 *
	 * @param User $user1 - the user context.
	 * @param string $path - the path of the file to move.
	 * @param User $user2 - the user to transfer the file to.
	 * @param string $destPath - the path to move the file to.
	 * @return bool - success
	 */
	static function transfer(User $user1, string $path, User $user2, string $destPath) {
		return Storage::move($user1->account->username . '/' . $path, $user2->account->username . '/' . $destPath);
	}

	/**
	 * Copy a user's file to another user.
	 *
	 * @param User $user1 - the user context.
	 * @param string $path - the path of the file to copy.
	 * @param User $user2 - the user to copy the file to.
	 * @param string $destPath - the path to copy the file to.
	 * @return bool - success
	 */
	static function duplicate(User $user1, string $path, User $user2, string $destPath) {
		return Storage::copy($user1->account->username . '/' . $path, $user2->account->username . '/' . $destPath);
	}

	/**
	 * Copy a user's directory to another user.
	 *
	 * @param User $user1 - the user context.
	 * @param string $path - the path of the directory to copy.
	 * @param User $user2 - the user to copy the directory to.
	 * @param string $destPath - the path to copy the directory to.
	 * @return bool - success
	 */
	static function duplicateDirectory(User $user1, string $path, User $user2, string $destPath) {
		return Directory::copyDirectory($user1->account->username . '/' . $path, $user2->account->username . '/' . $destPath);
	}

	/**
	 * Delete a user's file.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the path of the file to delete.
	 * @return bool - success
	 */
	static function delete(User $user, string $path) {
		return Storage::delete($user->account->username . '/' . $path);
	}

	/**
	 * Delete a user's directory.
	 *
	 * @param User $user - the user context.
	 * @param string $path - the path of the directory to delete.
	 * @return bool - success
	 */
	static function deleteDirectory(User $user, string $path) {
		return Directory::deleteDirectory($user->account->username . '/' . $path);
	}
}