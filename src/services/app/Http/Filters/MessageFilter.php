<?php
/******************************************************************************\
|                                                                              |
|                              MessageFilter.php                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a utility for filtering by message content.              |
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

class MessageFilter
{
	/**
	 * Apply message filter to query.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @param Illuminate\Database\Query\Builder $query - the query to apply filters to
	 * @return Illuminate\Database\Query\Builder
	 */
	static function applyTo(Request $request, $query) {

		// parse parameters
		//
		if ($request->has('message')) {
			$message = $request->input('message');
			$terms = explode(' or ', $message);

			for ($i = 0; $i < count($terms); $i++) {
				$term = trim($terms[$i]);

				$factors = explode(' and ', $term);
				for ($j = 0; $j < count($factors); $j++) {
					$factor = $factors[$j];

					if ($j == 0 && $i > 0) {
						$query = $query->orWhere('message', 'like', '%' . $factor . '%');
					} else {
						$query = $query->where('message', 'like', '%' . $factor . '%');
					}
				}	
			}
		}

		return $query;
	}
}