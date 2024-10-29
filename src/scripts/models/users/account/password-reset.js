/******************************************************************************\
|                                                                              |
|                                password-reset.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a password reset request event.               |
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
	// ajax attributes
	//

	urlRoot: config.servers.api + '/password-resets',

	//
	// querying methods
	//

	url: function() {
		return this.urlRoot + (this.isNew()? '' : '/' + this.get('id') + '/' + this.get('password_reset_nonce'));
	},

	//
	// resetting methods
	//

	reset: function(password, options) {
		return $.ajax(_.extend({
			url: this.urlRoot + '/reset',
			type: 'PUT',
			data: {
				'password': password,
				'key': this.get('key')
			}
		}, options));
	}
});
