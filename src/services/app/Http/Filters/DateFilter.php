<?php
/******************************************************************************\
|                                                                              |
|                                DateFilter.php                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by create date.                  |
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

class DateFilter
{
	/**
	 * Apply date filters to query.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Database\Query\Builder $query - the query to apply filters to
	 * @return Illuminate\Database\Query\Builder
	 */
	static function applyTo(Request $request, $query) {
		
		// parse parameters
		//
		if ($request->has('after')) {
			$after = date($request->input('after'));
			$query = $query->where('created_at', '>', $after);
		}
		if ($request->has('date')) {
			$date = date($request->input('date'));
			$query = $query->where('created_at', '=', $date);
		}
		if ($request->has('before')) {
			$before = date($request->input('before'));
			$query = $query->where('created_at', '<', $before);
		}

		return $query;
	}
}