<?php
/******************************************************************************\
|                                                                              |
|                               SearchFilter.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by name or keywords.             |
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

class SearchFilter
{
	/**
	 * Apply search filter to query.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Database\Query\Builder $query - the query to apply filters to
	 * @return Illuminate\Database\Query\Builder
	 */
	static function applyTo(Request $request, $query) {

		// parse parameters
		//
		$search = $request->input('search', null);

		// add name or keyword filter to query
		//
		if ($search) {
			$query = $query->where(function ($query) use ($search) {
				$query->where('name', 'like', '%' . $search . '%');
				$query->orwhere('keywords', 'like', '%' . $search . '%');
			});
		}

		return $query;
	}
}