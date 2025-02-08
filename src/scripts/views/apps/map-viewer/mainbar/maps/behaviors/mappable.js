/******************************************************************************\
|                                                                              |
|                                 mappable.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a set of behaviors for views that can be placed          |
|        on a map.                                                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// querying methods
	//

	hasGeolocation: function() {
		return this.model.hasGeolocation && this.model.hasGeolocation();
	},

	//
	// getting methods
	//

	getLatLon: function() {
		return this.model.getLatLon();
	},

	//
	// geoplacing methods
	//

	placeOn: function(mapView) {
		if (this.hasGeolocation()) {
			this.placeAt(mapView.latLonToOffset(this.model.getLatLon()));
		}
	}
};