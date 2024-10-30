/******************************************************************************\
|                                                                              |
|                                 component.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract base class for optical components.                |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';

export default BaseModel.extend({

	//
	// constructor
	//

	initialize: function(attributes) {

		// set attributes
		//
		this.set(attributes);

		return this;
	},

	//
	// setting methods
	//

	setAttribute: function(key, value, options) {

		// call superclass method
		//
		BaseModel.prototype.set.call(this, key, value, options);
	},

	setAttributes: function(attributes, options) {
		let keys = Object.keys(attributes);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			let value = attributes[key];
			this.setAttribute(key, value, {
				silent: true
			});
		}
		this.changed = attributes;
		if (!options || !options.silent) {
			this.trigger('change');
		}
	},

	set: function(key, value, options) {
		switch (typeof key) {
			case 'string':
				this.setAttribute(key, value, options);
				break;
			case 'object': {
				this.setAttributes(key, value);
				break;
			}
		}
	}
});