/******************************************************************************\
|                                                                              |
|                             user-affiliations.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user affiliations.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserAffiliation from '../../../models/users/profile/user-affiliation.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserAffiliation,

	//
	// getting methods
	//

	getCurrent: function() {
		let affiliation = this.at(0);
		if (affiliation && !affiliation.has('to_year')) {
			return affiliation;
		}
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/affiliations'
		}, options));
	}
});
