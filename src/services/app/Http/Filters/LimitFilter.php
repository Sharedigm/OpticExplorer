<?php
/******************************************************************************\
|                                                                              |
|                               LimitFilter.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by limit (number).               |
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

class LimitFilter
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
		$limit = $request->input('limit', 1000);

		// add limit to query
		//
		if ($limit) {
			$query = $query->take($limit);
		}

		return $query;
	}
}