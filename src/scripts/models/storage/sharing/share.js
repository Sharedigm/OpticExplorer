/******************************************************************************\
|                                                                              |
|                                    share.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a shared item.                                |
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
import User from '../../../models/users/user.js';
import Items from '../../../collections/storage/items.js';

export default Timestamped.extend({

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/shares',

	//
	// getting methods
	//

	getItem: function() {
		return Items.toItem({
			path: this.get('path')
		});
	},

	getOwnedItem: function() {
		return Items.toItem({
			path: this.get('owner_path')
		});
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
		if (data.user) {
			data.user = new User(data.user, {
				parse: true
			});
		}
		if (data.owner) {
			data.owner = new User(data.owner, {
				parse: true
			});
		}

		return data;
	}
});
