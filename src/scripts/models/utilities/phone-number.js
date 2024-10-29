/******************************************************************************\
|                                                                              |
|                                 phone-number.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of an international phone number.                |
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
		country_code: undefined,
		area_code: undefined,
		phone_number: undefined
	},

	//
	// constructor
	//

	initialize: function(attributes) {
		if (attributes) {
			this.set({
				country_code: attributes.country_code,
				area_code: attributes.area_code,
				phone_number: attributes.phone_number
			});
		}
	},

	//
	// querying methods
	//

	hasAttributes: function() {
		for (let attribute in this.attributes) {
			if (this.has(attribute)) {
				return true;
			}
		}
		return false;
	},

	//
	// converting methods
	//

	toString: function() {
		if (this.has('country_code') || this.has('area_code')) {
			let countryCode = this.get('country_code') || '';
			let areaCode = this.get('area_code') || '';
			let phoneNumber = this.get('phone_number') || '';

			// concatenate into string
			//
			return countryCode + ' ' + areaCode + ' ' + phoneNumber;
		} else {
			return this.get('phone_number');
		}
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {
		if (response && typeof(response) === 'string') {
			let substrings = response.split(' ');
			if (substrings.length >= 3) {
				return {
					'country_code': (substrings[0] != '' ? substrings[0] : undefined),
					'area_code': (substrings[1] != '' ? substrings[1] : undefined),
					'phone_number': (substrings[2] != '' ? substrings[2] : undefined)
				};
			} else {
				return {
					'phone_number': (substrings[0] != '' ? substrings[0] : undefined)
				};
			}
		} else {
			return response;
		}
	}
});