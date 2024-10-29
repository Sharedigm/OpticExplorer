/******************************************************************************\
|                                                                              |
|                              user-identities.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of a user's identities.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserIdentity from '../../../models/users/auth/user-identity.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// Backbone attributes
	//

	model: UserIdentity,

	//
	// querying methods
	//

	hasItemNamed: function(name) {
		return this.getItemNamed(name) != undefined;
	},

	//
	// getting methods
	//

	getItemNamed: function(name) {
		return this.findWhere({
			title: name
		});
	},

	//
	// fetching methods
	//

	fetchByCurrentUser: function(options) {
		return this.fetch(_.extend(options, {
			url: config.servers.api + '/identities'
		}));
	}
});
