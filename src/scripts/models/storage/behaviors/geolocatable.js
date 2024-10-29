/******************************************************************************\
|                                                                              |
|                                geolocatable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for finding a file's geolocation.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../models/places/place.js';
import DmsUtils from '../../../utilities/math/dms-utils.js';
import Fraction from '../../../utilities/math/fraction.js';
import Vector2 from '../../../utilities/math/vector2.js';

export default {

	//
	// querying methods
	//

	hasGeolocation: function() {
		if (this.has('exif')) {
			let exif = this.get('exif');
			return (exif.GPSLatitude != undefined && exif.GPSLongitude != undefined) ||
				(exif['GPS Latitude'] != undefined && exif['GPS Longitude'] != undefined);
		} else {
			return this.has('place');
		}
	},

	hasGeoOrientation: function() {
		if (this.has('exif')) {
			let exif = this.get('exif');
			return exif.GPSImgDirection != undefined || exif.CameraYaw != undefined;
		} else {
			return false;
		}
	},

	hasGeoposition: function() {
		return this.has('geocoords');
	},

	//
	// getting methods
	//

	getLatitudeDegrees: function(exif) {
		if (exif.GPSLatitude) {
			return DmsUtils.toDegrees(exif.GPSLatitude, 'fractions');
		} else if (exif['GPS Latitude']) {
			return DmsUtils.parse(exif['GPS Latitude'], 'units');
		}
	},

	getLongitudeDegrees: function(exif) {
		if (exif.GPSLongitude) {
			return DmsUtils.toDegrees(exif.GPSLongitude, 'fractions');
		} else if (exif['GPS Longitude']) {
			return DmsUtils.parse(exif['GPS Longitude'], 'units');
		}		
	},

	getLatitude: function(exif) {
		if (exif.GPSLatitudeRef) {
			switch (exif.GPSLatitudeRef) {
				case 'N': 
					return this.getLatitudeDegrees(exif);
				case 'S':
					return -this.getLatitudeDegrees(exif);
			}
		} else if (exif['GPS Latitude']) {
			let string = exif['GPS Latitude'];
			if (string.endsWith('N')) {
				return DmsUtils.parse(string.substr(0, string.length - 2), 'units');
			} else if (string.endsWith('S')) {
				return -DmsUtils.parse(string.substr(0, string.length - 2), 'units');		
			} else {
				return DmsUtils.parse(string, 'units');				
			}
		}
	},

	getLongitude: function(exif) {
		if (exif.GPSLongitudeRef) {
			switch (exif.GPSLongitudeRef) {
				case 'E': 
					return -this.getLongitudeDegrees(exif);
				case 'W':
					return this.getLongitudeDegrees(exif);
			}
		} else if (exif['GPS Longitude']) {
			let string = exif['GPS Longitude'];
			if (string.endsWith('W')) {
				return DmsUtils.parse(string.substr(0, string.length - 2), 'units');
			} else if (string.endsWith('E')) {
				return -DmsUtils.parse(string.substr(0, string.length - 2), 'units');		
			} else {
				return DmsUtils.parse(string, 'units');				
			}
		}
	},

	getLatLon: function() {
		if (this.has('exif')) {
			let exif = this.get('exif');
			return {
				latitude: this.getLatitude(exif),
				longitude: this.getLongitude(exif)
			};
		} else if (this.has('place')) {
			let place = this.get('place');
			return {
				latitude: place.get('latitude'),
				longitude: place.get('longitude')
			};
		}
	},

	averageLatLons(latLons) {
		let latitudes = 0;
		let longitudes = 0;
		for (let i = 0; i < latLons.length; i++) {
			latitudes += latLons[i].latitude;
			longitudes += latLons[i].longitude;
		}
		return {
			latitude: latitudes / latLons.length,
			longitude: longitudes / latLons.length
		}
	},

	getPlace: function(zoomLevel) {
		let latLon = this.has('geocoords')? this.averageLatLons(this.getLatLons()) : this.getLatLon();
		return new Place({
			latitude: latLon.latitude,
			longitude: latLon.longitude,
			zoom_level: zoomLevel
		});
	},

	getGeoOrientation: function() {
		if (this.has('exif')) {
			let exif = this.get('exif');
			if (exif.GPSImgDirection) {
				return {
					heading: new Fraction().parse(exif.GPSImgDirection).value(),
					pitch: 0,
					roll: 0
				};
			} else if (exif.CameraYaw) {
				return {
					heading: parseFloat(exif.CameraYaw),
					pitch: parseFloat(exif.CameraPitch),
					roll: parseFloat(exif.CameraRoll)
				};				
			}
		} else {
			return undefined;
		}
	},

	getLatLons: function() {
		let geocoords = this.get('geocoords');

		function formatDms(geocoords) {
			geocoords = geocoords.replace('d', ' deg ');
			geocoords = geocoords.replace("'", "' ");
			geocoords = geocoords.replace('"', '" ');
			return geocoords;
		}

		function formatLatLon(latLon) {
			let pair = latLon.split(', ');
			return {
				latitude: formatDms(pair[1]),
				longitude: formatDms(pair[0])
			};
		}

		// parse geocoords
		//
		return [
			DmsUtils.parseLatLon(formatLatLon(geocoords.upper_left)),
			DmsUtils.parseLatLon(formatLatLon(geocoords.upper_right)),
			DmsUtils.parseLatLon(formatLatLon(geocoords.lower_right)),
			DmsUtils.parseLatLon(formatLatLon(geocoords.lower_left))
		];
	},

	//
	// bounding box methods
	//

	getOverlayVertices: function(mapView) {
		let latLons = this.getLatLons();
		return [
			mapView.latLonToVector2(latLons[0]),
			mapView.latLonToVector2(latLons[1]),
			mapView.latLonToVector2(latLons[2]),
			mapView.latLonToVector2(latLons[3])
		];
	},

	getBoundingBoxVertices: function(origin, width, height, rotation) {
		let point0 = origin.rotatedBy(rotation);
		let point1 = point0.plus(new Vector2(width, 0).rotatedBy(rotation));
		let point2 = point1.plus(new Vector2(0, height).rotatedBy(rotation));
		let point3 = point0.plus(new Vector2(0, height).rotatedBy(rotation));
		return [point0, point1, point2, point3, point0];
	},

	getOverlayRotation: function(mapView) {
		let vertices = this.getOverlayVertices(mapView);
		let side = vertices[1].minus(vertices[0]);
		return new Vector2(1, 0).angleTo(side);
	},

	getOverlaySize: function(mapView) {
		let vertices = this.getOverlayVertices(mapView);
		let side1 = vertices[1].minus(vertices[0]);
		let side2 = vertices[0].minus(vertices[3]);
		return {
			width: side1.length(),
			height: side2.length()
		}
	},

	//
	// lat lon bounding box methods
	//

	getLatLonBoundingBox: function() {
		let latLons = this.getLatLons();
		return {
			upper_left: latLons[0],
			upper_right: latLons[1],
			lower_right: latLons[2],
			lower_left: latLons[3]
		};
	},

	getLatLonBox: function() {
		let latLons = this.getLatLonBoundingBox();
		let left = DmsUtils.average(latLons.upper_left, latLons.lower_left);
		let right = DmsUtils.average(latLons.upper_right, latLons.lower_right);
		let upper = DmsUtils.average(latLons.upper_left, latLons.upper_right);
		let lower = DmsUtils.average(latLons.lower_left, latLons.lower_right);
		let horizontal = DmsUtils.difference(left, right);
		let rotation = Math.atan2(horizontal.latitude, horizontal.longitude) * Math.PI / 180;

		return {
			east: left.longitude,
			west: right.longitude,
			north: upper.latitude,
			south: lower.latitude,
			rotation: rotation
		};
	}
};