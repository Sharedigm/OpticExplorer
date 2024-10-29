/******************************************************************************\
|                                                                              |
|                              user-email-addr.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal email address.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserContact from '../../../../models/users/profile/user-contact.js';

export default UserContact.extend({

	//
	// attributes
	//

	defaults: {
		email_addr_kind: undefined,
		email_addr: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/email-addrs',

	//
	// converting methods
	//

	toString: function() {
		return this.get('email_addr');
	},

	toContactInfo: function() {
		let json = {};

		if (this.has('email_addr_kind')) {
			json.email_addr_kind = this.get('email_addr_kind');
		}
		
		json.email_addr = this.get('email_addr');
		
		return json;
	},

	toVCF: function() {
		let line = '';
		line += 'EMAIL';

		if (this.has('email_addr_kind')) {
			line += ';TYPE=' + this.get('email_addr_kind');
		}
		
		line += ':';
		line += (this.get('email_addr') || '');
		
		return line;
	},

	fromVCF: function(line) {
		let pair = line.split(':');
		let key = pair[0];
		let value = pair[1];
		let kind;

		// parse email addr type
		//
		if (key.contains('TYPE=')) {
			pair = key.split('TYPE=');
			kind = pair[1];
		}

		// set attributes
		//
		this.set({
			'email_addr_kind': kind,
			'email_addr': value
		});

		return this;
	}
}, {

	//
	// static methods
	//

	toVCF: function(json) {
		let line = '';
		line += 'EMAIL';

		if (json.email_addr_kind) {
			line += ';TYPE=' + json.email_addr_kind;
		}
		
		line += ':';
		line += (json.email_addr || '');
		
		return line;
	}
});
