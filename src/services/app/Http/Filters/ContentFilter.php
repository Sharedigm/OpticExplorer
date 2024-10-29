<?php
/******************************************************************************\
|                                                                              |
|                              ContentFilter.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering items (files and directories).   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|            Copyright (C) 2016-2024, Sharedigm, www.sharedigm.com             |
\******************************************************************************/

namespace App\Http\Filters;

use Illuminate\Http\Request;
use App\Models\Storage\File;

class ContentFilter
{
	/**
	 * Apply content filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filter(Request $request, $items) {

		// parse parameters
		//
		$content = $request->input('content', null);

		// filter collection
		//
		if ($content) {
			$items = $items->filter(function($item) use ($content) {
				return $item instanceof File && $item->contains($content);
			})->values();
		}

		return $items;
	}
}