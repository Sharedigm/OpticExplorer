/******************************************************************************\
|                                                                              |
|                                  surface.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the abstract class definition of a lens surface.              |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Component from '../../../../models/optics/elements/component.js';

export default Component.extend({

	//
	// querying methods
	//

	isReflective: function() {
		return this.coating && this.constructor.reflective.contains(this.coating);
	},

	//
	// setting methods
	//

	setAttribute: function(key, value) {

		// set rendering attributes
		//
		if (value) {
			switch (key) {
				case 'diameter':
					this.diameter = value.in('mm');
					this.radius = this.diameter / 2;

					// if first surface, then update elements radius
					//
					if (this.getIndex() == 0 && this.parent) {
						this.parent.update();
					}
					break;
				case 'radius':
					this.setAttribute('diameter', value? value.times(2) : undefined);
					break;
				case 'spacing':
					this.setSpacing(value);
					break;
				case 'coating':
					this.coating = value;
					break;
			}
		}

		// set geometry attributes
		//
		if (key != 'spacing' && this.getSag) {
			this.thickness = Math.abs(this.getSag());
		}

		// call superclas method
		//
		Component.prototype.setAttribute.call(this, key, value);
	},

	set: function(attributes, options) {

		// call superclass method
		//
		Component.prototype.set.call(this, attributes, options);

		// update
		//
		if (this.parent && this.parent.update) {
			this.parent.update();
		}
	},

	unset: function(attribute) {

		// unset object attributes
		//
		if (attribute == 'radius') {
			this.radius = undefined;
		}
		if (attribute == 'diameter') {
			this.diameter = undefined;
		}
		if (attribute == 'thickness') {
			this.thickness = undefined;
		}

		// unset model attributes
		//
		this.attributes[attribute] = undefined;
	},

	//
	// querying methods
	//

	get: function(attribute) {
		switch (attribute) {
			case 'aperture':
				return this.getAperture();
			case 'distance':
				switch (this.getSide()) {
					case 'front':
						return this.parent.get('thickness');
					case 'back':
						return this.parent.get('spacing');
				}
				return;
			default:
				return Component.prototype.get.call(this, attribute);	
		}
	},

	getAperture: function() {
		return this.diameter;
	},

	getIndex: function() {
		return this.index + (this.parent? this.parent.getIndex() * 2 : 0);
	},

	getSide: function() {
		switch (this.index) {
			case 0:
				return 'front';
			case 1:
				return 'back';
		}
	},

	getOpposite: function() {
		switch (this.getSide()) {
			case 'front':
				return this.parent.back;
			case 'back':
				return this.parent.front;
		}
	},

	getFocusType: function() {
		let side = this.getSide();
		let focalLength = this.parent.getFocalLength(side);
		switch (side) {
			case 'front':
				return focalLength < 0? 'real' : 'virtual';
			case 'back':
				return focalLength > 0? 'real' : 'virtual';
		}
	},

	getSpacing: function() {
		switch (this.getSide()) {
			case 'front':
				return this.parent.get('thickness');
			case 'back':
				return this.parent.get('spacing');
		}
	},

	//
	// setting methods
	//

	setSpacing: function(spacing) {
		switch (this.getSide()) {
			case 'front':
				this.parent.set({
					thickness: spacing
				});
				break;
			case 'back':
				this.parent.set({
					spacing: spacing
				});
				break;
		}
	}
}, {

	//
	// static attributes
	//

	reflective: [
		'aluminum',
		'silver',
		'gold'
	],
	coatings: [
		'single',
		'multi',
		'silver',
		'aluminum',
		'dielectric',
		'gold'
	]
});