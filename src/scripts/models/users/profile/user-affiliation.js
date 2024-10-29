/******************************************************************************\
|                                                                              |
|                             user-affiliation.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal affiliation.                |
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
		role: 'member',
		organization_name: undefined,
		organization_website: undefined,
		organization_unit: undefined,
		from_year: undefined,
		to_year: undefined
	},

	urlRoot: config.servers.api + '/users/affiliations',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return user && user.get('id') == this.get('user_id');
	},

	//
	// getting methods
	//

	getUrl: function() {
		if (this.has('organization_website') && this.get('organization_website') != '') {
			let url = this.get('organization_website');

			// add protocol
			//
			if (url.startsWith('http')) {
				return url;
			} else {
				return 'http://' + url;
			}
		}
	},
	
	//
	// converting methods
	//

	toString: function() {
		return this.get('role') + ' at ' + this.get('organization_name');
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
			data.from_year = undefined;
		}
		if (data.to_year == 0) {
			data.to_year = undefined;
		}

		return data;
	}
});
