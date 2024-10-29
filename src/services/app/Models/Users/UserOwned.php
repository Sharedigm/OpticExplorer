<?php
/******************************************************************************\
|                                                                              |
|                                 UserOwned.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of being associated with a user.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Models\Users;

use Illuminate\Support\Facades\Session;

trait UserOwned {

	//
	// relationship methods
	//

	/**
	 * Get this item's relationship to its user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function user() {
		return $this->belongsTo('App\Models\Users\User');
	}

	//
	// querying methods
	//

	/**
	 * Return if this item is used by a particular user.
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\Relation
	 */
	public function isOwnedBy($userId) {
		return $this->user_id == $userId;
	}

	//
	// query scope methods
	//

	/**
	 * Allow queries for this item to return only items belonging to a particular user.
	 *
	 * @param Illuminate\Database\Query\Builder $query
	 * @param string $userId
	 * @return Illuminate\Database\Query\Builder
	 */
	public function scopeBelongingTo($query, $userId) {
		return $query->where('user_id', '=', $userId);
	}
}
