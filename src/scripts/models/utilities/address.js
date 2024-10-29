/******************************************************************************\
|                                                                              |
|                                   address.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of physical / geographical street address.       |
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
		street_address: undefined,
		apartment: undefined,
		city: undefined,
		state: undefined,
		postal_code: undefined,
		country: undefined
	},

	/*
	//
	// converting methods
	//

	toString: function() {
		return (
			(this.get('street_address') || '')  + ', ' +
			(this.get('apartment') || '') + ', ' +
			(this.get('city') || '') + ', ' +
			(this.get('state') || '') + ', ' +
			(this.get('postal_code') || '') + ', ' +
			(this.get('country') || ''));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {
		if (response) {
			let substrings = response.split(', ');
			return {
				'street_address': (substrings[0] != '' ? substrings[0] : undefined),
				'apartment': (substrings[1] != '' ? substrings[1] : undefined),
				'city': (substrings[2] != '' ? substrings[2] : undefined),
				'state': (substrings[3] != '' ? substrings[3] : undefined),
				'postal_code': (substrings[4] != '' ? substrings[4] : undefined),
				'country': (substrings[5] != '' ? substrings[5] : undefined)
			};
		}
	}
	*/
});