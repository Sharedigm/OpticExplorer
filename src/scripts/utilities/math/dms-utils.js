/******************************************************************************\
|                                                                              |
|                                dms-utils.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a class for helping with unit conversions.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Fraction from '../../utilities/math/fraction.js';

export default {

	//
	// array to degrees conversion
	//

	toDegrees: function(dms, format) {
		switch (format) {

			// convert dms string array in the form: 
			// [float float float]
			//
			case 'decimal':
				return this.toDegrees([
					parseFloat(dms[0]),
					parseFloat(dms[1]),
					parseFloat(dms[2])
				]);

			// convert dms string array in the form: 
			// [<float> deg <float>' <float>"]
			//
			case 'units':
				return this.toDegrees([
					dms[0],
					dms[2].replace("'", ''),
					dms[3].replace('"', '')
				], 'decimal');

			// convert dms string array in the form: 
			// [<fraction> <fraction> <fraction>]
			//
			case 'fractions':
				return this.toDegrees([
					new Fraction().parse(dms[0]).value(),
					new Fraction().parse(dms[1]).value(),
					new Fraction().parse(dms[2]).value()
				]);

			// convert dms string array in the form: 
			// [<fraction> deg <fraction>' <fraction>"]
			//
			case 'fractions/units':
				return this.toDegrees([
					dms[0],
					dms[2].replace("'", ''),
					dms[3].replace('"', '')
				], 'fractions');

			// convert numerical dms array to degrees
			//
			default:
				return dms[0] + (dms[1] / 60) + (dms[2] / 3600);
		}
	},

	sum: function(latLon1, latLon2) {
		return {
			latitude: latLon1.latitude + latLon1.latitude,
			longitude: latLon1.longitude + latLon2.longitude
		};
	},

	difference: function(latLon1, latLon2) {
		return {
			latitude: latLon1.latitude - latLon1.latitude,
			longitude: latLon1.longitude - latLon2.longitude
		};
	},

	average: function(latLon1, latLon2) {
		return {
			latitude: (latLon1.latitude + latLon2.latitude) / 2,
			longitude: (latLon1.longitude + latLon2.longitude) / 2
		};
	},

	length: function(latLon) {
		return Math.sqrt(Math.sqr(latLon.latitude) + Math.sqr(latLon.longitude));
	},

	//
	// string to degrees conversions
	//

	parse: function(string, format) {
		return this.toDegrees(string.split(' '), format);
	},

	parseDms: function(string) {
		let terms = string.split(/[ ,]+/);
		let degrees = parseFloat(terms[0]);
		let minutes = parseFloat(terms[2].replace("'", ''));
		let seconds = parseFloat(terms[3].replace('"', ''));
		return this.toDegrees([degrees, minutes, seconds]);
	},

	parseLatLon: function(latLon) {
		return {
			latitude: this.parseDms(latLon.latitude.replace(' N', '')),
			longitude: this.parseDms(latLon.longitude.replace(' W', ''))
		};
	}
};