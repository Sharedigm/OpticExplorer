/******************************************************************************\
|                                                                              |
|                                   light.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of an abstract base class for lights.          |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		'on': true
	},

	//
	// constructor
	//
	
	initialize: function() {

		// set default number of rays
		//
		if (!this.has('number_of_rays')) {
			this.set('number_of_rays', this.defaults['number_of_rays']);
		}
	},

	//
	// querying methods
	//

	isMultispectral: function() {
		return this.hasSpectrum() && this.numWavelengths() > 1;
	},

	hasSpectrum: function() {
		return this.has('spectrum') && typeof this.get('spectrum') != 'string';
	},

	//
	// counting methods
	//

	numWavelengths: function() {
		return this.has('spectrum')? this.get('spectrum').numWavelengths() : 0;
	},

	//
	// getting methods
	//

	getColor: function() {
		if (this.has('color')) {
			return this.get('color');
		} else if (this.has('spectrum')) {
			return this.get('spectrum').getColor();
		}
	},

	//
	// setting methods
	//

	toObject: function(object) {

		// create object
		//
		if (!object) {
			object = {};
		}

		// add optional attributes
		//
		if (this.has('color')) {
			object.color = '"' + this.get('color') + '"';
		}
		if (this.has('spectrum')) {
			object.spectrum = this.get('spectrum').toString();
		}
		if (this.has('number_of_rays')) {
			object.number_of_rays = this.get('number_of_rays').toString();
		}

		return object;
	}
});