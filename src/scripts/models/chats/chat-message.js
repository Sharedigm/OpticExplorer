/******************************************************************************\
|                                                                              |
|                                chat-message.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a text messaging chat message.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';
import User from '../../models/users/user.js';
import CheckIn from '../../models/places/check-in.js';
import Items from '../../collections/storage/items.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		user: undefined,
		message: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/chats/messages',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return this.get('user').is(user);
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
		if (data.attachments) {
			data.attachments = new Items(data.attachments, {
				parse: true
			});
		}
		if (data.check_in) {
			data.check_in = new CheckIn(data.check_in, {
				parse: true
			});
		}

		return data;
	}
});
