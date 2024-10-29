<?php
/******************************************************************************\
|                                                                              |
|                             ItemGeolocatable.php                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a trait of a geolocatable file system item.              |
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
use App\Models\Places\ItemPlace;
use App\Models\Places\Place;

trait ItemGeolocatable
{
	//
	// accessor methods
	//

	/**
	 * Get this geolocatable item's place attribute.
	 *
	 * @return App\Models\Users\User
	 */
	public function getPlaceAttribute(): ?Place {
		$itemPlace = ItemPlace::where('user_id', '=', Session::get('user_id'))->where('path', '=', $this->path)->first();
		if ($itemPlace) {
			return $itemPlace->place;
		} else {
			return null;
		}
	}
}