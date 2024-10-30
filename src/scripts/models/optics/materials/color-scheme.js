/******************************************************************************\
|                                                                              |
|                               color-scheme.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a material color scheme.                    |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';
import ColorUtils from '../../../utilities/multimedia/color-utils.js';

export default BaseModel.extend({

	//
	// getting methods
	//

	getColorOf: function(material) {
		let indexOfRefraction = material.getIndexOfRefraction();
		let abbeNumber = material.getAbbeNumber();
		return this.getColorAt(indexOfRefraction, abbeNumber);
	},

	getColorAt: function(indexOfRefraction, abbeNumber) {

		// blend low to high index glass colors
		//
		let index = Math.clamp(indexOfRefraction, this.attributes.low_index, this.attributes.high_index);
		let factor = (index - this.attributes.low_index) / (this.attributes.high_index - this.attributes.low_index);
		let color = ColorUtils.blendRgbColors(this.attributes.low_index_color, this.attributes.high_index_color, factor);

		// add abbe number contribution
		//
		if (abbeNumber) {
			abbeNumber = Math.clamp(abbeNumber, this.attributes.low_abbe_number, this.attributes.high_abbe_number);
			factor = (abbeNumber - this.attributes.low_abbe_number) / (this.attributes.high_abbe_number - this.attributes.low_abbe_number);
			color = ColorUtils.addRgbColors(color, ColorUtils.blendRgbColors(this.attributes.low_abbe_color, this.attributes.high_abbe_color, factor))
		}

		return color;	
	}
}, {

	//
	// static attributes
	//

	schemes: {},
	current: undefined,
	current_name: undefined,

	//
	// static methods
	//

	setScheme: function(name, value) {
		this.schemes[name] = value;
	},

	setCurrent: function(name) {
		if (this.current_name != name) {
			this.current_name = name;
			this.current = this.schemes[name];

			/*
			if (!this.current) {
				this.current = this.schemes[name];
			} else {
				this.current.set(this.schemes[name].attributes);
			}
			*/
		}
	},

	getCurrent: function() {
		return this.current;
	},

	getColorScheme: function(name) {
		return this.schemes[name];
	},

	getCurrentName: function() {
		return this.current_name;
	}
});