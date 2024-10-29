<?php

namespace App\Http\Controllers\Utilities;

use App\Models\Utilities\WindStation;
use App\Http\Controllers\Controller;

class WindStationController extends Controller
{
	/**
	 * Get all wind stations.
	 *
	 * @return App\Models\Utilities\WindStation[]
	 */
	public function getAll() {
		$countries = WindStation::all();
		return $countries;
	}
}