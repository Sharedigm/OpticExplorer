<?php
/******************************************************************************\
|                                                                              |
|                                NameFilter.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by name (string).                |
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

class NameFilter
{
	/**
	 * Apply name filter to query.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Database\Query\Builder $query - the query to apply filters to
	 * @return Illuminate\Database\Query\Builder
	 */
	static function applyTo(Request $request, $query) {

		// parse parameters
		//
		$name = $request->input('name', null);

		// add name filter to query
		//
		if ($name) {
			$query = $query->where('name', 'like', '%' . $name . '%');
		}

		return $query;
	}
}