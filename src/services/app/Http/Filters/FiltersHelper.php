<?php

namespace App\Http\Filters;

/*
|--------------------------------------------------------------------------
| Filter Functions
|--------------------------------------------------------------------------
|
| Below you will find a set of utility functions used to protect access to routes
|
*/

class FiltersHelper
{
	static function method() {
		return strtolower( $_SERVER['REQUEST_METHOD'] );
	}

	static function filterPassword(string $string) {
		return str_ireplace("<script>", "", $string);
	}
}