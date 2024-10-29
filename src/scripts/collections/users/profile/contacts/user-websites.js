/******************************************************************************\
|                                                                              |
|                               user-websites.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user websites.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserWebsite from '../../../../models/users/profile/contacts/user-website.js';
import BaseCollection from '../../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserWebsite,

	//
	// sorting methods
	//

	comparator: function(model) {
		return model.get('url');
	},

	//
	// converting methods
	//

	toVCF: function() {
		let lines = [];

		// add websites to lines
		//
		for (let i = 0; i < this.length; i++) {
			lines.push(this.at(i).toVCF());
		}

		return lines;
	},
	
	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/websites'
		}, options));
	}
});
