<?php
/******************************************************************************\
|                                                                              |
|                              SharingFilters.php                              |
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

class SharingFilters
{
	//
	// sharing filters
	//

	/**
	 * Apply shared by filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterBySharedBy(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('shared-by')) {
			$userId = trim($request->input('shared-by'), '"');

			// filter collection
			//
			$items = $items->filter(function($item) use ($userId) {
				return $item->owner && $item->owner->id == $userId;
			})->values();
		}

		return $items;
	}

	//
	// shares filters
	//

	/**
	 * Apply min shares filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByMinShares(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('min-shares')) {
			$minShares = intval($request->input('min-shares'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($minShares) {
				return $item->num_shares > $minShares;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply num shares filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByNumShares(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('shares')) {
			$numShares = intval($request->input('shares'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($numShares) {
				return $item->num_shares == $numShares;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply max shares filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByMaxShares(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('max-shares')) {
			$maxShares = intval($request->input('max-shares'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($maxShares) {
				return $item->num_shares < $maxShares;
			})->values();
		}

		return $items;
	}

	//
	// links filters
	//

	/**
	 * Apply min links filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByMinLinks(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('min-links')) {
			$minLinks = intval($request->input('min-links'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($minLinks) {
				return $item->num_links > $minLinks;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply num links filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByNumLinks(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('links')) {
			$numLinks = intval($request->input('links'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($numLinks) {
				return $item->num_links == $numLinks;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply max links filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByMaxLinks(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('max-links')) {
			$maxLinks = intval($request->input('max-links'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($maxLinks) {
				return $item->num_links < $maxLinks;
			})->values();
		}

		return $items;
	}

	//
	// item filters
	//

	/**
	 * Apply sharing filters to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filter(Request $request, $items) {

		// apply sharing filters
		//
		$items = self::filterBySharedBy($request, $items);

		$items = self::filterByMinShares($request, $items);
		$items = self::filterByNumShares($request, $items);
		$items = self::filterByMaxShares($request, $items);

		$items = self::filterByMinLinks($request, $items);
		$items = self::filterByNumLinks($request, $items);
		$items = self::filterByMaxLinks($request, $items);
		
		return $items;
	}
}