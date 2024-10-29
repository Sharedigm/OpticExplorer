<?php
/******************************************************************************\
|                                                                              |
|                               RangeFilter.php                                |
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

class RangeFilter
{
	/**
	 * Apply range filter to query.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Database\Query\Builder $query - the query to apply filters to
	 * @param integer $limit - the value of the range limit
	 * @return Illuminate\Database\Query\Builder
	 */
	static function applyTo(Request $request, $query, $limit = null) {
		$from = null;
		$to = null;

		// parse parameters
		//
		if ($request->has('from')) {
			$from = filter_var($request->input('from'), FILTER_VALIDATE_INT);
		}
		if ($request->has('to')) {
			$to = filter_var($request->input('to'), FILTER_VALIDATE_INT);
		} else if ($limit) {
			$to = $from + $limit;
		}

		// add limit to query
		//
		if ($from) {
			$query = $query->skip($from);
		}
		if ($to) {
			$query = $query->take($to - $from + 1);
		}

		return $query;
	}
}