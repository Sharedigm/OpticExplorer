/******************************************************************************\
|                                                                              |
|                               metar-station.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a metar weather data station.                 |
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
		elevation_m: undefined,

		// timestamps
		//
		issue_time: undefined,
		bulletin_time: undefined,
		valid_time_from: undefined,
		valid_time_to: undefined,
		remarks: undefined,

		// weather data
		//
		raw_text: undefined,
		sky_condition: undefined
	},

	skyCovers: ['CLR', 'SKC', 'FEW', 'SCT', 'BKN', 'OVC', 'OVX'],

	//
	// converting methods
	//

	skyCoverToLevel: function(skyCover) {
		return this.skyCovers.indexOf(skyCover);
	},

	levelToSkyCover: function(level) {
		return this.skyCovers[level];
	},

	//
	// getting methods
	//

	getStationId: function() {
		return this.get('station_id');
	},

	getMetarString: function() {
		return this.get('raw_text');
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
	},

	getSkyCover: function() {
		let skyCondition = this.get('sky_condition');
		if (skyCondition) {
			if (skyCondition.length == 1) {
				return skyCondition[0].sky_cover.toLowerCase();	
			} else {
				let level = this.skyCoverToLevel(skyCondition[0].sky_cover);
				for (let i = 1; i < skyCondition.length; i++) {
					level = Math.max(level, this.skyCoverToLevel(skyCondition[i].sky_cover));
				}
				return this.levelToSkyCover(level).toLowerCase();
			}
		}
	},

	getCeiling: function() {
		let skyCondition = this.get('sky_condition');
		if (skyCondition) {
			if (skyCondition.length > 0) {
				skyCondition = skyCondition[0];
			}
			return skyCondition.cloud_base_ft_agl;
		}
	},

	getVisibility: function() {
		return this.get('visibility_statute_mi');
	},

	getCategory: function() {
		let category = this.get('flight_category');

		if (category) {
			return category.toLowerCase();
		} else {
			let ceiling = this.getCeiling();
			let visibility = this.getVisibility();

			if (ceiling > 3000 && (!visibility || visibility > 5)) {
				return 'vfr';
			} else if (ceiling >= 1000 && (!visibility || visibility >= 3)) {
				return 'mvfr';
			} else if (ceiling >= 500 && (!visibility || visibility >= 1)) {
				return 'ifr';
			} else if (ceiling) {
				return 'lifr';
			} else {
				return 'missing';
			}
		}
	},

	//
	// XML parsing methods
	//

	parseForecast: function(element) {
		return this.parseAttributes(element, {
			'fcst_time_from': 'text',
			'fcst_time_to': 'text',
			'wind_dir_degrees': 'float',
			'wind_speed_kt': 'float',
			'visibility_statute_mi': 'float',
			'wx_string': 'text',
			'sky_condition': 'sky_condition'
		});
	},

	parseForecasts: function(elements) {
		let forecasts = [];
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			forecasts.push(this.parseForecast(element));
		}
		return forecasts;
	},

	parseSkyConditions: function(elements) {
		let conditions = [];
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			conditions.push({
				sky_cover: element.getAttribute('sky_cover'),
				cloud_base_ft_agl: parseInt(element.getAttribute('cloud_base_ft_agl'))
			});
		}
		return conditions;
	},

	parseAttributes: function(element, types) {
		let attributes = {};
		let keys = Object.keys(types);
		for (let i = 0; i < keys.length; i++) {
			let name = keys[i];
			let type = types[name];
			let elements = element.getElementsByTagName(name);

			if (elements && elements.length > 0) {
				switch (type) {
					case 'text':
						attributes[name] = elements[0].textContent;
						break;
					case 'int':
						attributes[name] = parseInt(elements[0].textContent);
						break;
					case 'float':
						attributes[name] = parseFloat(elements[0].textContent);
						break;
					case 'forecast':
						attributes[name] = this.parseForecasts(elements);
						break;
					case 'sky_condition':
						attributes[name] = this.parseSkyConditions(elements);
						break;
					default:
						break;
				}
			}
		}
		return attributes;
	},

	parse: function(element) {
		this.set(this.parseAttributes(element, {
			'raw_text': 'text',
			'station_id': 'text',
			'observation_time': 'text',

			'latitude': 'float',
			'longitude': 'float',
			'elevation_m': 'float',

			'visibility_statute_mi': 'text',
			'sky_condition': 'sky_condition',
			'flight_category': 'text'
		}));
		return this;
	}
});
