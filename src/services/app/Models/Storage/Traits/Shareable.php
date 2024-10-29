<?php
/******************************************************************************\
|                                                                              |
|                                 Shareable.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of a shareable storage system item.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Storage\Traits;

use Illuminate\Support\Facades\Session;
use App\Models\Storage\Item;
use App\Models\Storage\Sharing\Share;
use App\Models\Storage\Sharing\ShareRequest;
use App\Models\Users\User;
use App\Models\Users\Auth\UserSession;
use App\Utilities\Storage\FileStorage;
use App\Utilities\Strings\StringUtils;

trait Shareable
{
	//
	// accessor methods
	//

	/**
	 * Get this shareable item's owner attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getOwnerAttribute(): ?User {
		if ($this->isShared()) {
			return $this->getOwner();
		} else {
			return null;
		}
	}

	/**
	 * Get this shareable item's num shares attribute.
	 *
	 * @return int
	 */
	public function getNumSharesAttribute(): int {
		if ($this->path && User::current()) {
			return ShareRequest::belongingTo(Session::get('user_id'))
				->where('path', '=',  $this->path)->count();
		} else {
			return 0;
		}
	}

	//
	// relationship methods
	//

	/**
	 * Get this shareable item's relationship to its share.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function share() {
		 return $this->belongsTo('App\Models\Storage\Sharing\Share');
	}

	//
	// sharing querying methods
	//

	/**
	 * Get whether or not this shareable item is shared.
	 *
	 * @return bool
	 */
	public function isShared(): bool {
		return $this->share && $this->share->path == $this->path;
	}

	/**
	 * Find if this item is dereferenced from the root directory
	 *
	 * @return bool
	 */
	public function isAbsolute(): bool {
		return StringUtils::startsWith($this->path, '/');
	}

	/**
	 * Get whether or not this shareable item has an owner.
	 *
	 * @return bool
	 */
	public function hasOwner(): bool {
		if ($this->share) {
			return true;
		} else if ($this->link) {
			return true;
		} else {
			return UserSession::exists();
		}
	}

	/**
	 * Get this shareable item's owner.
	 *
	 * @return App\Models\Users\User
	 */
	public function getOwner(): ?User {
		if ($this->share) {
			return $this->share->owner;
		} else if ($this->public_id) {
			return User::find($this->public_id);
		} else if ($this->link) {
			return $this->link->user;
		} else {
			return User::current();
		}
	}

	//
	// share querying
	//

	/**
	 * Find whether this shareable item has shares.
	 *
	 * @return bool
	 */
	public function hasShares(): bool {
		return Share::where('owner_id', '=', $this->getOwner()->user_id)
			->where('owner_path', '=', $this->path)->exists();
	}

	/**
	 * Find this shareable item's number of shares.
	 *
	 * @return int
	 */
	public function numShares(): int {
		return Share::where('owner_id', '=', $this->getOwner()->user_id)
			->where('owner_path', '=', $this->path)->count();
	}

	/**
	 * Get this shareable item's shares.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getShares(): Collection {
		return Share::where('owner_id', '=', $this->getOwner()->user_id)
			->where('owner_path', '=', $this->path)->get();
	}

	//
	// share request querying
	//

	/**
	 * Find whether this shareable item has share requests.
	 *
	 * @return bool
	 */
	public function hasShareRequests(): bool {
		return ShareRequest::where('user_id', '=', $this->getOwner()->user_id)
			->where('path', '=', $this->path)->exists();
	}

	/**
	 * Find this shareable item's number of share requests.
	 *
	 * @return int
	 */
	public function numShareRequests(): int {
		return ShareRequest::where('user_id', '=', $this->getOwner()->user_id)
			->where('path', '=', $this->path)->count();
	}

	/**
	 * Get this shareable item's share requests.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getShareRequests(): Collection {
		return ShareRequest::where('user_id', '=', $this->getOwner()->user_id)
			->where('path', '=', $this->path)->get();
	}

	//
	// sharing methods
	//

	/**
	 * Copy this shareable item's share from another item.
	 *
	 * @param App\Models\Storage\Item $item
	 * @return void
	 */
	public function copyShare(Item $item) {
		$this->share_id = $item->share_id;
	}

	/**
	 * Remove this item's share.
	 *
	 * @return void
	 */
	public function unshare() {
		unset($this->share_id);
	}

	/**
	 * Clears this shareable item's related items.
	 *
	 * @return void
	 */
	public function clear() {

		// delete sharing
		//
		$shareRequests = ShareRequest::where('user_id', '=', $this->getOwner()->user_id)
			->where('path', 'like', $this->path . '%')->delete();
		$shares = Share::where('owner_id', '=', $this->getOwner()->user_id)
			->where('owner_path', 'like', $this->path . '%')->delete(); 
	}

	//
	// path querying methods
	//

	/**
	 * Get this shareable item's home directory as an absolute path.
	 *
	 * @return string
	 */
	public function homedir(): string {
		if ($this->share) {
			return $this->share->owner->account->username . '/';
		} else if ($this->public_id) {
			return UserAccount::find($this->public_id)->username . '/Public/';
		} else {
			return FileStorage::current();
		}
	}

	/**
	 * Get this shareable item's path as a relative path.
	 *
	 * @return string
	 */
	public function localPath(): string {
		if ($this->share) {
			return $this->ownerPath();
		} else if ($this->path) {
			return $this->path;
		} else {
			return '';
		}
	}

	/**
	 * Get this shareable item's path relative to its owner.
	 *
	 * @return string
	 */
	public function ownerPath(): string {
		if ($this->share) {
			return $this->share->ownerPath($this->path);
		} else if ($this->public_id) {
			return 'Public/' . $this->path;
		} else if ($this->path) {
			return $this->path;
		} else {
			return '';
		}
	}

	/**
	 * Get this item's full path relative to the storage root.
	 *
	 * @return string
	 */
	public function fullPath(): string {

		// return root path
		//
		if (str_starts_with($this->path, '/')) {
			return substr($this->path, 1);
		}

		// return path to item in local storage
		//
		return $this->homedir() . $this->localPath();
	}

	//
	// updating methods
	//
	
	/**
	 * Move this shareable item to a destination path.
	 *
	 * @param string $dest - the destination to move the item to.
	 * @return bool
	 */
	public function moveTo(string $dest): bool {

		// check if item has been shared directly
		//
		if ($this->isShared()) {

			// move item in database
			//
			$share = $this->share;
			$share->path = $dest;
			return $share->save();

		// check if item is contained in a shared directory
		//
		} else if ($this->share) {
			$dest = $this->share->ownerPath($dest);
			return FileStorage::move($this->getOwner(), $this->ownerPath(), $dest);
		} else {

			// check if item has been shared with others
			//
			if ($this->hasShareRequests()) {

				// update share request paths
				//
				$shareRequests = $this->getShareRequests();
				for ($i = 0; $i < sizeof($shareRequests); $i++) {
					$shareRequests[$i]->path = $dest;
					$shareRequests[$i]->save();
				}			
			}
			if ($this->hasShares()) {

				// update share paths
				//
				$shares = $this->getShares();
				for ($i = 0; $i < sizeof($shares); $i++) {
					$shares[$i]->owner_path = $dest;
					$shares[$i]->save();
				}

			}

			// check if storage exists
			//
			$storage = $this->getStorage();
			if (!$storage) {
				return false;
			}

			// move item in storage
			//
			return $storage->move($this->getPath(), $this->homedir() . $dest);
		}
	}

	/**
	 * Move this shareable item to a destination path of another user.
	 *
	 * @param App\Models\Users\User $user - the user to move the item to.
	 * @param string $dest - the destination to move the item to.
	 * @return bool
	 */
	public function transferTo(User $user, string $dest) {

		// transfer item in user storage
		//
		return FileStorage::transfer($this->getOwner(), $this->ownerPath(), $user, $dest);
	}

	//
	// deleting methods
	//

	/**
	 * Remove this item and its children's shares.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function deleteShares() {
		return Share::where('user_id', '=', $this->getOwner()->id)
			->where('path', 'like', $this->path . '%')
			->delete();
	}

	/**
	 * Delete this shareable item.
	 *
	 * @return App\Models\Storage\Item
	 */
	public function delete() {

		// delete share requests associated with item
		//
		$shareRequests = ShareRequest::where('user_id', '=', $this->getOwner()->user_id)
			->where('path', '=', $this->path)->delete();

		// delete shares associated with item
		//
		$shares = Share::where('owner_id', '=', $this->getOwner()->user_id)
			->where('owner_path', '=', $this->path)->delete();

		// check if item has been shared directly
		//
		if ($this->isShared()) {
			$this->unshare();

			// delete item in database
			//
			$share = $this->share;
			return $share->delete();
			
		// check if item is contained in a shared directory
		//
		} else if ($this->share) {

			// delete item in user storage
			//
			return FileStorage::delete($this->getOwner(), $this->ownerPath());

		// item is not shared
		//
		} else {

			// check if storage exists
			//
			$storage = $this->getStorage();
			if (!$storage) {
				return false;
			}

			// delete item in storage
			//
			return $storage->delete($this->getPath());
		}
	}
}