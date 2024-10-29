/******************************************************************************\
|                                                                              |
|                                user-schools.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user schools.                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserSchool from '../../../models/users/profile/user-school.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserSchool,

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
		let school = this.at(0);
		if (school && !school.has('to_year')) {
			return school;
		}
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/schools'
		}, options));
	}
});
