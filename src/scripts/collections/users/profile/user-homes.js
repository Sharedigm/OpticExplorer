/******************************************************************************\
|                                                                              |
|                                 user-homes.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user homes.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserHome from '../../../models/users/profile/user-home.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserHome,

	//
	// sorting methods
	//

	comparator: function(model) {
		let year = model.get('from_year') || model.get('to_year');
		return year? -year : undefined;
	},

	//
	// getting methods
	//

	getCurrent: function() {
		let home = this.at(0);
		if (home && !home.has('to_year')) {
			return home;
		}
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/homes'
		}, options));
	}
});
