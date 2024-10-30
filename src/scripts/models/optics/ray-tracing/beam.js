/******************************************************************************\
|                                                                              |
|                                    beam.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a beam (composed of an array of paths).     |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';

export default BaseModel.extend({

	//
	// constructor
	//

	initialize: function(options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}

		// set attributes
		//
		this.options = options;

		// listen to model changes
		//
		if (options.light) {
			this.listenTo(this.light, 'change', this.onChange);
		}
	},

	update: function() {

		// set beam to light's color
		//
		if (this.options.light) {
			this.set({
				color: this.option.light.get('color')
			});
		}
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	}
});