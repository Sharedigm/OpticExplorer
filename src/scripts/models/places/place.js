/******************************************************************************\
|                                                                              |
|                                   place.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a geographical place.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		name: undefined,
		icon_path: undefined,
		description: undefined,
		latitude: undefined,
		longitude: undefined,
		zoom_level: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/places',

	//
	// getting methods
	//

	getName: function() {
		return this.get('name');
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.longitude) {
			data.longitude = parseFloat(data.longitude);
		}
		if (data.latitude) {
			data.latitude = parseFloat(data.latitude);
		}
		if (data.zoom_level) {
			data.zoom_level = parseFloat(data.zoom_level);
		}

		return data;
	},

	toJSON: function() {

		// call superclass method
		//
		let json = Timestamped.prototype.toJSON.call(this);

		// serialize attributes
		//
		if (this.has('longitude')) {
			json.longitude = this.get('longitude').toPrecision(7);
		}
		if (this.has('latitude')) {
			json.latitude = this.get('latitude').toPrecision(7);
		}
		if (this.has('zoom_level')) {
			json.zoom_level = this.get('zoom_level').toPrecision(3);
		}

		return json;
	},

	hasGeolocation: function() {
		return true;
	},
	
	getLatLon: function() {
		return {
			latitude: this.get('latitude'),
			longitude: this.get('longitude')
		};
	}
});