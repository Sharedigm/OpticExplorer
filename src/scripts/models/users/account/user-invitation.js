/******************************************************************************\
|                                                                              |
|                              user-invitation.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user invitation.                            |
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

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		invitee_name: undefined,
		invitee_email: undefined,
		message: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/invitations',

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.inviter) {
			data.inviter = new User(data.inviter, {
				parse: true
			});
		}

		return data;
	}
});
