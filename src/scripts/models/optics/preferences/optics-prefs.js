/******************************************************************************\
|                                                                              |
|                               optics-prefs.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a set of a user's preferences.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSettings from '../../../models/users/user-settings.js';

export default UserSettings.extend({

	// attributes
	//
	app: 'optics',

	defaults: {

		// annotation preferences
		//
		'arrow_style': 'filled',
		'label_style': 'diagonal',

		// viewport preferences
		//
		'show_grid': true,
		'show_x_axis': true,
		'show_y_axis': false,

		// ray tracing preferences
		//
		'filled_light_beams': true,
		'stroked_light_beams': true,
		'show_obstructed_rays': true,
		'max_ray_depth': 50
	},

	//
	// constructor
	//

	initialize: function() {

		// listen for changes
		//
		this.on('change', this.onChange);
	},

	//
	// methods
	//

	apply: function(view) {
		this.constructor.current = this;

		if (view) {
			this.view = view;
		}

		for (let key in this.attributes) {
			let value = this.attributes[key];
			this.view.setOption(key, value);
		}
	},
	
	reset: function() {
		this.set(this.defaults);
	},

	//
	// event handling methods
	//

	onChange: function() {

		// apply preferences
		//
		this.apply();

		// save preferences
		//
		application.saveOptions();
	}
}, {

	//
	// static attributes
	//

	current: null
});