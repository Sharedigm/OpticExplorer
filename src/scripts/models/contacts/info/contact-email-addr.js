/******************************************************************************\
|                                                                              |
|                            contact-email-addr.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a contact's personal email address.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ContactInfo from '../../../models/contacts/info/contact-info.js';

export default ContactInfo.extend({

	//
	// attributes
	//

	defaults: {
		email_addr_kind: undefined,
		email_addr: undefined
	}
}, {

	//
	// static methods
	//

	JSONtoVCF: function(json) {
		let line = '';
		line += 'EMAIL';

		if (json.email_addr_kind) {
			line += ';TYPE=' + json.email_addr_kind;
		}
		
		line += ':';
		line += (json.email_addr || '');
		
		return line;
	},

	VCFtoJSON: function(line) {
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

		return {
			'email_addr_kind': kind,
			'email_addr': value
		};
	}
});
