<?php
/******************************************************************************\
|                                                                              |
|                               PublicFilter.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by public flag.                  |
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
use App\Models\Users\Auth\UserSession;

class PublicFilter
{
	/**
	 * Apply public filter to query.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Database\Query\Builder $query - the query to apply filters to
	 * @return Illuminate\Database\Query\Builder
	 */
	static function applyTo(Request $request, $query) {

		// parse parameters
		//
		if (!UserSession::exists() || $request->get('public') == 'true') {
			$query = $query->where('public', '=', 1);
		}

		return $query;
	}
}