/******************************************************************************\
|                                                                              |
|                              email-verification.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of user account email verification.              |
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
	// ajax attributes
	//

	urlRoot: config.servers.api + '/verifications',

	//
	// verifying methods
	//

	verify: function(options) {
		return $.ajax(_.extend({
			url: this.url() + '/verify',
			type: 'PUT'
		}, options));
	},

	resend: function(username, password, options) {
		return $.ajax(_.extend({
			url: config.servers.api + '/verifications/resend',
			type: 'POST',
			data: {
				'username': username,
				'password': password
			}
		}, options));
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

		return data;
	}
});