/******************************************************************************\
|                                                                              |
|                                 user-home.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's residency history.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../../models/utilities/timestamped.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		city: undefined,
		state: undefined,
		country: undefined,
		from_year: undefined,
		to_year: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/homes',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return user && user.get('id') == this.get('user_id');
	},

	hasName: function() {
		return this.has('city') || this.has('state') || this.has('country');
	},

	//
	// getting methods
	//

	getName: function() {
		return this.toString();
	},

	//
	// converting methods
	//

	toString: function() {
		let name;
		if (this.has('city')) {
			name = this.get('city');
		}
		if (this.has('state')) {
			let state = this.get('state');
			if (name && state.length > 0) {
				name += ', ';
			}
			name += state;
		} else if (this.has('country')) {
			let country = this.get('country');
			if (country != 'United States') {
				if (name && country.length > 0) {
					name += ', ';
				}
				name += this.get('country');
			}
		}
		return name;
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
		if (data.from_year == 0) {
			data.from_year = null;
		}
		if (data.to_year == 0) {
			data.to_year = null;
		}

		return data;
	}
});
