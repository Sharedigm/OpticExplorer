/******************************************************************************\
|                                                                              |
|                           containable-mappable.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a set of behaviors for mappable container views.         |
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
	// geolocating methods
	//

	placeOn: function(mapView) {
		for (let i = 0; i < this.children.length; i++) {
			this.children.findByIndex(i).placeOn(mapView);
		}
	},

	updatePlaces: function(mapView) {
		for (let i = 0; i < this.children.length; i++) {
			this.children.findByIndex(i).updatePlace(mapView);
		}
	}
};