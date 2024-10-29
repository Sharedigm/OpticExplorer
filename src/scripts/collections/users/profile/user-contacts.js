/******************************************************************************\
|                                                                              |
|                               user-contacts.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user contact info.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserAddress from '../../../models/users/profile/contacts/user-address.js';
import UserEmailAddr from '../../../models/users/profile/contacts/user-email-addr.js';
import UserPhone from '../../../models/users/profile/contacts/user-phone.js';
import UserWebsite from '../../../models/users/profile/contacts/user-website.js';
import BaseCollection from '../../../collections/base-collection.js';
import UserAddresses from '../../../collections/users/profile/contacts/user-addresses.js';
import UserEmailAddrs from '../../../collections/users/profile/contacts/user-email-addrs.js';
import UserPhones from '../../../collections/users/profile/contacts/user-phones.js';
import UserWebsites from '../../../collections/users/profile/contacts/user-websites.js';

export default BaseCollection.extend({

	//
	// converting methods
	//

	toContactInfo: function() {
		let array = [];

		for (let i = 0; i < this.length; i++) {
			let contact = this.at(i);
			array.push(contact.toContactInfo());
		}

		return array;
	},

	toVCF: function() {
		let lines = [];

		for (let i = 0; i < this.length; i++) {
			let contact = this.at(i);
			lines = lines.concat(contact.toVCF());
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
					this.add(new UserAddress().fromVCF(line));
					break;

				case 'EMAIL':
					this.add(new UserEmailAddr().fromVCF(line));
					break;

				case 'TEL':
					this.add(new UserPhone().fromVCF(line));
					break;

				case 'URL':
					this.add(new UserWebsite().fromVCF(line));
					break;
			}
		}

		return this;
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return new UserAddresses().fetchByUser(user, {

			// callbacks
			//
			success: (collection) => {
				this.add(collection.models);
				new UserEmailAddrs().fetchByUser(user, {

					// callbacks
					//
					success: (collection) => {
						this.add(collection.models);
						new UserPhones().fetchByUser(user, {

							// callbacks
							//
							success: (collection) => {
								this.add(collection.models);
								new UserWebsites().fetchByUser(user, {

									// callbacks
									//
									success: (collection) => {
										this.add(collection.models);
										if (options && options.success) {
											options.success(this);
										}
									}
								});
							}
						});
					}
				});
			}
		});
	}
}, {

	//
	// static methods
	//

	toVCF: function(json) {
		let lines = [];

		for (let i = 0; i < json.length; i++) {
			let item = json[i];
			if (item.street_address) {
				lines = lines.concat(UserAddress.toVCF(item));
			} else if (item.email_addr_kind) {
				lines = lines.concat(UserEmailAddr.toVCF(item));
			} else if (item.phone_kind) {
				lines = lines.concat(UserPhone.toVCF(item));
			} else if (item.website_kind) {
				lines = lines.concat(UserWebsite.toVCF(item));
			}
		}

		return lines;
	}
});