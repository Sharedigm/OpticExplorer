<?php
/******************************************************************************\
|                                                                              |
|                                  Linkable.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of a linkable storage system item.               |
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

use App\Models\Storage\Sharing\Link;
use App\Models\Users\User;
use App\Models\Users\Auth\UserSession;

trait Linkable
{
	//
	// accessor methods
	//

	/**
	 * Get this item's num links attribute.
	 *
	 * @return int
	 */
	public function getNumLinksAttribute(): int {
		if ($this->hasOwner()) {
			return Link::belongingTo($this->getOwner()->id)
				->where('path', '=', $this->ownerPath())->count();
		} else {
			return 0;
		}
	}

	//
	// relationship methods
	//

	/**
	 * Get this item's relationship to its owner.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function owner() {
		return $this->belongsTo('App\Models\Users\User', 'owner_id');
	}

	/**
	 * Get this item's relationship to its link.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function link() {
		 return $this->belongsTo('App\Models\Storage\Sharing\Link');
	}

	//
	// querying methods
	//

	//
	// functions
	//

	/**
	 * Check if this item has a link context.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function hasLink() {
		return $this->link_id != null;
	}

	/**
	 * Get this item's link context.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getLink() {
		return Link::find($this->link_id);
	}

	/**
	 * Get this item's links.
	 *
	 * @return Illuminate\Support\Collection
	 */
	public function getLinks(): Collection {
		return Link::where('user_id', '=', $this->getOwner()->user_id)
			->where('path', '=', $this->ownerPath())->get();
	}

	//
	// linking methods
	//

	/**
	 * Create a link to this item.
	 *
	 * @param object $attributes
	 * @return App\Models\Storage\Sharing\Link
	 */
	public function createLink(object $attributes): Link {

		// create new link
		//
		$link = new Link(array_merge($attributes, [
			'link_id' => Guid::create(),
			'user_id' => Session::get('user_id'),
			'path' => $this->path
		]));
		$link->save();

		return $link;
	}
}
