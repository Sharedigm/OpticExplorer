/******************************************************************************\
|                                                                              |
|                                   element.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract base class for optical elements.                  |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Component from '../../../models/optics/elements/component.js';

export default Component.extend({

	//
	// constructor
	//

	initialize: function(attributes) {

		// call superclass constructor
		//
		Component.prototype.initialize.call(this, attributes)
		
		return this;
	},

	//
	// querying methods
	//

	isDisabled: function() {
		return this.get('disabled');
	},

	isHidden: function() {
		return this.get('hidden');
	},

	isCoating: function() {
		return this.thickness <= 0.01;
	},

	isSkipped: function() {
		return this.isDisabled() || this.isHidden() || this.isCoating();
	},

	//
	// order querying methods
	//

	isFirst: function() {
		return this.getIndex() == 0;
	},

	isLast: function() {
		return this.getIndex() == this.collection.length - 1;
	},

	prev: function(options) {
		return this.collection.prev(this, options);
	},

	next: function(options) {
		return this.collection.next(this, options);
	},

	nextVisible: function(ray, origin, options) {
		return this.collection.nextVisible(ray, origin, this, options);
	},

	//
	// getting methods
	//

	getIndex: function() {
		if (this.collection) {
			return this.collection.indexOf(this);
		}
	},

	//
	// setting methods
	//

	setAttribute: function(key, value, options) {

		// set rendering attributes
		//
		switch (key) {
			case 'spacing':
				this.spacing = value? value.in('mm') : 0;
				break;
		}

		// call superclass method
		//
		Component.prototype.setAttribute.call(this, key, value, options);
	}
});