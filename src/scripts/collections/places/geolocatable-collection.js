/******************************************************************************\
|                                                                              |
|                            geolocatable-collection.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a base collection and generic utility methods.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	default_zoom_level: 9,

	//
	// geolocating methods
	//

	hasGeolocation: function() {

		// check models
		//
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.hasGeolocation && model.hasGeolocation()) {
				return true;
			}
		}

		if (this.hasGeoposition()) {
			return true;
		}

		return false;
	},

	hasGeoposition: function() {

		// check models
		//
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.hasGeoposition && model.hasGeoposition()) {
				return true;
			}
		}

		return false;
	},

	getLatLons: function() {
		let latLons = [];
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.hasGeolocation && model.hasGeolocation()) {
				latLons.push(model.getLatLon());
			} else if (model.hasGeoposition && model.hasGeoposition()) {
				latLons = latLons.concat(model.getLatLons());
			}
		}
		return latLons;
	},

	getPlaces: function() {
		let places = [];
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.has('place')) {
				places.push(model.get('place'));
			}
		}
		return places;
	},

	getGeoBounds: function() {
		let minLatitude, maxLatitude;
		let minLongitude, maxLongitude;
		let latLons = this.getLatLons();

		if (latLons.length == 0) {
			return;
		}

		// average locations
		//
		for (let i = 0; i < latLons.length; i++) {
			let latLon = latLons[i];

			if (!minLatitude || latLon.latitude < minLatitude) {
				minLatitude = latLon.latitude;
			}
			if (!maxLatitude || latLon.latitude > maxLatitude) {
				maxLatitude = latLon.latitude;
			}
			if (!minLongitude || latLon.longitude < minLongitude) {
				minLongitude = latLon.longitude;
			}
			if (!maxLongitude || latLon.longitude > maxLongitude) {
				maxLongitude = latLon.longitude;
			}
		}

		return {
			min_latitude: minLatitude,
			max_latitude: maxLatitude,
			min_longitude: minLongitude,
			max_longitude: maxLongitude,
		};
	},

	getLatLon: function() {
		let bounds = this.getGeoBounds();
		if (bounds) {
			return {
				latitude: (bounds.min_latitude + bounds.max_latitude) / 2,
				longitude: (bounds.min_longitude + bounds.max_longitude) / 2
			};
		}
	},

	getAvgGeolocation: function() {
		let count = 0;
		let latitude = 0;
		let longitude = 0;
		let latLons = this.getLatLons();

		if (latLons.length == 0) {
			return;
		}

		// average locations
		//
		for (let i = 0; i < latLons.length; i++) {
			let latLon = latLons[i];
			latitude += latLon.latitude;
			longitude += latLon.longitude;
			count++;
		}

		return {
			latitude: latitude / count,
			longitude: longitude / count
		};
	},

	getZoomLevel: function() {
		let minLatitude, maxLatitude;
		let minLongitude, maxLongitude;
		let width, height, size;
		let latLons = this.getLatLons();
		let zoomLevel;

		if (latLons.length == 0) {
			return;
		}
		if (latLons.length == 1) {
			let places = this.getPlaces();
			if (places.length == 1) {
				return places[0].get('zoom_level');
			}
		}
		
		// average geolocations
		//
		for (let i = 0; i < latLons.length; i++) {
			let latLon = latLons[i];

			if (!minLatitude || latLon.latitude < minLatitude) {
				minLatitude = latLon.latitude;
			}
			if (!maxLatitude || latLon.latitude > maxLatitude) {
				maxLatitude = latLon.latitude;
			}
			if (!minLongitude || latLon.longitude < minLongitude) {
				minLongitude = latLon.longitude;
			}
			if (!maxLongitude || latLon.longitude > maxLongitude) {
				maxLongitude = latLon.longitude;
			}
		}

		width = (maxLongitude - minLongitude) / 360;
		height = (maxLatitude - minLatitude) / 180;
		size = Math.sqrt(width * width + height * height) * 1.1;
		if (size > 0) {
			zoomLevel = (Math.log2(1 / size) + 1) / 2;
			if (zoomLevel < 1) {
				zoomLevel = 1;
			}
		}

		return zoomLevel;
	},

	//
	// geo orientation methods
	//

	hasOrientation: function() {

		// check models
		//
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.hasOrientation && model.hasOrientation()) {
				return true;
			}
		}

		return false;
	},
}, {

	//
	// static attributes
	//

	filters: {
		is_geolocated: (model) => model.hasGeolocation && model.hasGeolocation(),
		is_geopositioned: (model) => model.hasGeoposition && model.hasGeoposition()
	}
});