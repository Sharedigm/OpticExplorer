<?php
/******************************************************************************\
|                                                                              |
|                               ItemFilters.php                                |
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
use App\Utilities\Strings\StringUtils;

class ItemFilters
{
	//
	// item name filter
	//

	/**
	 * Apply name filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByName(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('name')) {
			$name = trim($request->input('name'), '"');
			$terms = explode(' ', urldecode($name));

			// filter collection
			//
			$items = $items->filter(function($item) use ($name, $terms) {
				$dirname = dirname($item->path);

				// filter out thumbnails
				//
				if (StringUtils::endsWith($dirname, '.Thumbs')) {
					return false;
				} else {

					// filter by name
					//
					$basename = basename($item->path);
					$filename = pathinfo($basename, PATHINFO_FILENAME);
					$count = 0;

					// check if all terms in search are present in name
					//
					for ($i = 0; $i < count($terms); $i++) {
						$term = trim($terms[$i]);
						if (str_contains(strtolower($filename), strtolower($term))) {
							$count++;
						} else {
							return false;
						}
					}
					return $count == count($terms);
				}
			})->values();
		}

		return $items;
	}

	/**
	 * Apply file kind filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByFileKind(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('kind')) {
			$kind = trim($request->input('kind'), '"');

			// filter collection
			//
			$items = $items->filter(function($item) use ($kind) {
				$extension = pathinfo(basename($item->path), PATHINFO_EXTENSION);
				return strpos(strtolower($extension), strtolower($kind)) !== false;
			})->values();
		}

		return $items;
	}

	//
	// size filters
	//

	/**
	 * Apply min size filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByMinSize(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('min_size')) {
			$minSize = intval($request->input('min_size'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($minSize) {
				return $item instanceof File && $item->size > $minSize;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply size filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterBySize(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('size')) {
			$size = intval($request->input('size'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($size) {
				return $item instanceof File && $item->size == $minSize;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply max size filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByMaxSize(Request $request, $items) {

		// parse parameters
		//
		if ($request->has('max_size')) {
			$size = intval($request->input('max_size'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($size) {
				return $item instanceof File && $item->size < $size;
			})->values();
		}

		return $items;
	}

	//
	// date filters
	//

	/**
	 * Apply create date filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByCreateDate(Request $request, $items) {

		// filter by before create date
		//
		if ($request->has('before-create-date')) {
			$date = strtotime($request->input('before-create-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->created_at < $date;
			})->values();
		}

		// filter by create date
		//
		if ($request->has('create-date')) {
			$date = strtotime($request->input('create-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->created_at == $date;
			})->values();
		}

		// filter by after create date
		//
		if ($request->has('after-create-date')) {
			$date = strtotime($request->input('after-create-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->created_at > $date;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply modify date filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByModifyDate(Request $request, $items) {

		// filter by before modify date
		//
		if ($request->has('before-modify-date')) {
			$date = strtotime($request->input('before-modify-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->modified_at < $date;
			})->values();
		}

		// filter by modify date
		//
		if ($request->has('modify-date')) {
			$date = strtotime($request->input('modify-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->modified_at == $date;
			})->values();
		}

		// filter by modified after
		//
		if ($request->has('after-modify-date')) {
			$date = strtotime($request->input('after-modify-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->modified_at > $date;
			})->values();
		}

		return $items;
	}

	/**
	 * Apply access date filter to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filterByAccessDate(Request $request, $items) {

		// filter by before access date
		//
		if ($request->has('before-access-date')) {
			$date = strtotime($request->input('before-access-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->accessed_at < $date;
			})->values();
		}

		// filter by access date
		//
		if ($request->has('access-date')) {
			$date = strtotime($request->input('access-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->accessed_at == $date;
			})->values();
		}

		// filter by after access date
		//
		if ($request->has('after-access-date')) {
			$date = strtotime($request->input('after-access-date'));

			// filter collection
			//
			$items = $items->filter(function($item) use ($date) {
				return $item->accessed_at > $date;
			})->values();
		}

		return $items;
	}

	//
	// item filters
	//

	/**
	 * Apply item filters to collection.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Support\Collection $items
	 * @return Illuminate\Support\Collection
	 */
	static function filter(Request $request, $items) {

		// apply name filters
		//
		$items = self::filterByName($request, $items);
		$items = self::filterByFileKind($request, $items);

		// apply size filters
		//
		$items = self::filterByMinSize($request, $items);
		$items = self::filterBySize($request, $items);
		$items = self::filterByMaxSize($request, $items);

		// apply date filters
		//
		$items = self::filterByCreateDate($request, $items);
		$items = self::filterByModifyDate($request, $items);
		$items = self::filterByAccessDate($request, $items);
		
		return $items;
	}
}