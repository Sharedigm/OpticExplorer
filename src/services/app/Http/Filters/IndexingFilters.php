<?php
/******************************************************************************\
|                                                                              |
|                             IndexingFilters.php                              |
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

class IndexingFilters
{
	/**
	 * Apply indexing filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filter(Request $request, $items) {

		// filter collection
		//
		$items = $items->filter(function($item) {
			return $item->isIndexable();
		})->values();

		return $items;
	}

	/**
	 * Apply indexed filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByIndexed(Request $request, $items) {

		// filter collection
		//
		$items = $items->filter(function($item) {
			return $item->isIndexed();
		})->values();

		return $items;
	}
}