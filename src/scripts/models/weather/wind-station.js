/******************************************************************************\
|                                                                              |
|                               wind-station.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a wind weather data station.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		station_id: undefined,
		latitude: undefined,
		longitude: undefined,
		issue_time: undefined,

		// weather data
		//
		winds: undefined
	},

	//
	// getting methods
	//

	getStationId: function() {
		return this.get('station_id');
	},

	getLowIndex: function(keys, value, values) {
		let index;
		for (let i = 1; i < keys.length; i++) {
			let key = keys[i];
			if (!values[key]) {
				continue;
			}
			if ((!value || parseInt(key) > value) && index != undefined) {
				return index;
			}
			index = i;
		}
		return keys.length - 1;
	},

	getHighIndex: function(keys, start, value, values) {
		for (let i = start; i < keys.length; i++) {
			let key = keys[i];
			if (!values[key]) {
				continue;
			}
			if (!value || parseInt(key) > value) {
				return i;
			}
		}
		return keys.length - 1;
	},

	getWindDirection: function(windLevel) {
		let winds = this.get('winds');
		let wind = winds[windLevel || 3000];

		// check if we have a valid measurement at this wind level
		//
		if (wind && wind != '9900') {
			return this.constructor.getWindDirection(wind);
		} else {

			// interpolate to this wind level
			//
			let levels = Object.keys(winds);
			let lowIndex = this.getLowIndex(levels, windLevel, winds);
			let highIndex = this.getHighIndex(levels, lowIndex, windLevel, winds);
			let lowLevel = levels[lowIndex];
			let highLevel = levels[highIndex];
			let lowValue = this.constructor.getWindDirection(winds[lowLevel]);
			let highValue = this.constructor.getWindDirection(winds[highLevel]);
			
			// make sure that angles are in the same hemicircle
			//
			if (Math.abs(highValue - lowValue) > 180) {
				if (highValue - lowValue > 0) {
					highValue -= 360;
				} else {
					highValue += 360;
				}
			}

			if (lowValue == highValue) {
				return lowValue;
			} else {
				return Math.round(lowValue + (highValue - lowValue) * (windLevel - lowLevel) / (highLevel - lowLevel));
			}
		}
	},

	getWindSpeed: function(windLevel) {
		let winds = this.get('winds');
		let wind = winds[windLevel || 3000];

		// check if we have a valid measurement at this wind level
		//
		if (wind && wind != '9900') {
			return this.constructor.getWindSpeed(wind);
		} else {

			// interpolate to this wind level
			//
			let levels = Object.keys(winds);
			let lowIndex = this.getLowIndex(levels, windLevel, winds);
			let highIndex = this.getHighIndex(levels, lowIndex, windLevel, winds);
			let lowLevel = levels[lowIndex];
			let highLevel = levels[highIndex];
			let lowValue = this.constructor.getWindSpeed(winds[lowLevel]);
			let highValue = this.constructor.getWindSpeed(winds[highLevel]);

			if (lowValue == highValue) {
				return lowValue;
			} else {
				return Math.round(lowValue + (highValue - lowValue) * (windLevel - lowLevel) / (highLevel - lowLevel));
			}
		}
	},

	getLatLon: function() {
		return {
			latitude: this.get('latitude'),
			longitude: this.get('longitude')
		};
	},

	getLatLonStr: function() {
		let latitude = this.get('latitude');
		let longitude = this.get('longitude');
		latitude = Math.abs(latitude) + (latitude < 0? '°N' : '°N');
		longitude = Math.abs(longitude) + (longitude < 0? '°E' : '°W');
		return latitude + ', ' + longitude; 
	}
}, {

	//
	// static methods
	//

	getWindDirection: function(windCode) {

		// check for light and variable
		//
		if (windCode.startsWith('9900')) {
			return undefined;
		}

		let firstDigit = parseInt(windCode.substr(0, 1));
		if (firstDigit < 4) {

			// wind speeds < 100
			//
			return parseInt(windCode.substr(0, 2)) * 10;
		} else {

			// wind speeds > 100
			//
			return (parseInt(windCode.substr(0, 2)) - 50) * 10;
		}
	},

	getWindSpeed: function(windCode) {

		// check for light and variable
		//
		if (windCode.startsWith('9900')) {
			return 0;
		}

		let firstDigit = parseInt(windCode.substr(0, 1));
		if (firstDigit < 4) {

			// wind speeds < 100
			//
			return parseInt(windCode.substr(2,2));
		} else {

			// wind speeds > 100
			//
			return parseInt(windCode.substr(2,2)) + 100;
		}
	}
});
