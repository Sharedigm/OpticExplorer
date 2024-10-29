<?php

namespace App\Http\Controllers\Utilities;

use App\Models\Utilities\Country;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
	/**
	 * Get all countries.
	 *
	 * @return App\Models\Utilities\Country[]
	 */
	public function getAll() {
		$countries = Country::all();
		return $countries;
	}
}