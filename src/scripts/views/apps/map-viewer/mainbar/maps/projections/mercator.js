/******************************************************************************\
|                                                                              |
|                                 mercator.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract utility for rendering maps using tiles.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import Vector2 from '../../../../../../utilities/math/vector2.js';

export default class Mercator {

	//
	// forward projecting methods
	//

	longitudeToX(longitude) {

		// clamp longitude range from 0 to 360
		//
		longitude = 180 - longitude;
		while (longitude < 0) {
			longitude += 360;
		}
		while (longitude > 360) {
			longitude -= 360;
		}

		// convert to map coords (0 to 1)
		//
		return longitude / 360;
	}

	latitudeToY(latitude) {

		// clamp latitude range from -90 to 90
		//
		if (latitude > 90) {
			latitude = latitude - 180;
		}
		if (latitude < -90) {
			latitude = latitude + 180;
		}

		// convert latitude from degrees to radians
		//
		let phi = latitude * Mercator.degreesToRadians;
		
		// perform Mercator projection
		//
		let sin = Math.sin(phi);
		let y = Math.log((1 + sin) / (1 - sin)) / 2;

		// since the Mercator projection runs from -infinity to infinity
		// in the y direction, we limit the y range clipping the poles.
		//
		return (1 - (y / Mercator.maxLatitude)) / 2;	
	}

	latLonToVector2(latLon) {
		return new Vector2(
			this.longitudeToX(latLon.longitude),
			this.latitudeToY(latLon.latitude)
		);
	}

	//
	// inverse projecting methods
	//

	toLongitude(x) {
		return 180 - (x * 360);
	}

	toLatitude(y) {
		let y2 = (1 - (y * 2)) * Mercator.maxLatitude;
		let sign = Math.sign(y2);
		let latitude = Math.atan(Math.sinh(Math.abs(y2)));
		return latitude * Mercator.radiansToDegrees * sign;
	}

	vector2ToLatLon(vector2) {
		return {
			latitude: this.toLatitude(vector2.y),
			longitude: this.toLongitude(vector2.x)
		};
	}

	static maxLatitude = Math.PI;
	static degreesToRadians = Math.PI / 180;
	static radiansToDegrees = 180 / Math.PI;
}