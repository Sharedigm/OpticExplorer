/******************************************************************************\
|                                                                              |
|                           contact-organizations.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of contact organizations.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ContactAddress from '../../../models/contacts/info/contact-address.js';
import ContactEmailAddr from '../../../models/contacts/info/contact-email-addr.js';
import ContactPhone from '../../../models/contacts/info/contact-phone.js';
import ContactWebsite from '../../../models/contacts/info/contact-website.js';
import ContactOrganization from '../../../models/contacts/organizations/contact-organization.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: ContactOrganization,

	//
	// converting methods
	//

	toVCF: function() {
		let lines = [];

		// add contact addresses to lines
		//
		for (let i = 0; i < this.length; i++) {
			lines.push(this.at(i).toVCF());
		}

		return lines;
	},

	fromVCF: function(lines) {

		// parse lines
		//
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// break line into key value pairs
			//
			let pair = line.split(':');
			let key = pair[0];

			if (key.contains(';')) {
				pair = key.split(';');
				key = pair[0];
			}

			switch (key) {

				case 'ADR':
					this.add(new ContactAddress().fromVCF(line));
					break;

				case 'EMAIL':
					this.add(new ContactEmailAddr().fromVCF(line));
					break;

				case 'TEL':
					this.add(new ContactPhone().fromVCF(line));
					break;

				case 'URL':
					this.add(new ContactWebsite().fromVCF(line));
					break;
			}
		}

		return this;
	}
});
