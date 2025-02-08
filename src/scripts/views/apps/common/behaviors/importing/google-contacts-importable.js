/******************************************************************************\
|                                                                              |
|                        google-contacts-importable.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for importing Google contacts.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Contact from '../../../../../models/contacts/contact.js';
import ContactOrganization from '../../../../../models/contacts/organizations/contact-organization.js';
import ContactAddress from '../../../../../models/contacts/info/contact-address.js';
import ContactEmailAddr from '../../../../../models/contacts/info/contact-email-addr.js';
import ContactPhone from '../../../../../models/contacts/info/contact-phone.js';
import ContactWebsite from '../../../../../models/contacts/info/contact-website.js';

//
// private variables
//

let scope = 'https://www.googleapis.com/auth/contacts.readonly';
let method = 'https://www.google.com/m8/feeds/contacts/default/thin?alt=json';

export default {

	//
	// converting methods
	//

	dataToContacts: function(data) {
		return this.entriesToContacts(data.feed.entry);
	},

	entriesToContacts: function(entries) {
		let users = [];
		for (let i = 0; i < entries.length; i++) {
			users.push(this.entryToContact(entries[i]));
		}
		return users;
	},

	entryToContact: function(entry) {
		let contact = new Contact({
			first_name: entry.gd$name.gd$givenName.$t,
			last_name: entry.gd$name.gd$familyName.$t,
		});

		// add user organization info
		//
		if (entry.gd$organization) {
			contact.organization = this.entryToOrganization(entry.gd$organization[0]);
		}

		// add user contact info
		//
		contact.info = [];
		if (entry.gd$email) {
			contact.info = contact.info.concat(this.entryToEmailAddrs(entry.gd$email));
		}
		if (entry.gd$phoneNumber) {
			contact.info = contact.info.concat(this.entryToPhones(entry.gd$phoneNumber));
		}
		if (entry.gd$structuredPostalAddress) {
			contact.info = contact.info.concat(this.entryToAddresses(entry.gd$structuredPostalAddress));
		}
		if (entry.gContact$website) {
			contact.info = contact.info.concat(this.entryToWebsites(entry.gContact$website));
		}

		return contact;
	},

	entryToOrganization: function(entry) {
		return new ContactOrganization({
			company_name: entry.gd$orgName.$t,
			title: entry.gd$orgTitle.$t,
		});
	},

	//
	// email parsing methods
	//

	entryToEmailAddrs: function(entries) {
		let emailAddrs = [];
		for (let i = 0; i < entries.length; i++) {
			emailAddrs.push(this.entryToEmailAddr(entries[i]));
		}
		return emailAddrs;
	},

	entryToEmailAddr: function(entry) {
		return new ContactEmailAddr({
			email_addr_kind: 'home',
			email_addr: entry.address,
		});
	},

	//
	// phone number parsing methods
	//

	entryToPhones: function(entries) {
		let phones = [];
		for (let i = 0; i < entries.length; i++) {
			phones.push(this.entryToPhone(entries[i]));
		}
		return phones;
	},

	entryToPhone: function(entry) {
		return new ContactPhone(_.extend({
			phone_kind: 'home'
		}, ContactPhone.parse(entry.$t)));
	},

	//
	// address parsing methods
	//

	entryToAddresses: function(entries) {
		let addresses = [];
		for (let i = 0; i < entries.length; i++) {
			addresses.push(this.entryToAddress(entries[i]));
		}
		return addresses;
	},

	entryToAddress: function(entry) {
		return new ContactAddress({
			address_kind: 'home',
			street_address: entry.gd$street.$t,
			city: entry.gd$city.$t,
			state: entry.gd$region.$t,
			country: entry.gd$country.$t == 'US'? 'United States' : entry.gd$country.$t,
			postal_code: entry.gd$postcode.$t
		});
	},

	//
	// website parsing methods
	//

	entryToWebsites: function(entries) {
		let websites = [];
		for (let i = 0; i < entries.length; i++) {
			websites.push(this.entryToWebsite(entries[i]));
		}
		return websites;
	},

	entryToWebsite: function(entry) {
		return new ContactWebsite({
			website_kind: entry.rel == 'home-page'? 'homepage' : entry.label,
			website_protocol: ContactWebsite.getProtocol(entry.href),
			url: ContactWebsite.getUrl(entry.href),
		});
	},

	//
	// methods
	//

	importGoogleContacts: function(callback) {
		import(
			'https://apis.google.com/js/api.js'
		).then(() => {
			gapi.load('auth', {
				callback: () => {
					gapi.auth.authorize({
						client_id: config.storage.google.clientId,
						scope: scope,
						immediate: false
					}, (authorizationResult) => {
						$.ajax({
							url: method + "&access_token=" + authorizationResult.access_token + "&max-results=500&v=3.0",
							type: "GET",
							dataType: 'json',
							xhrFields: {
								withCredentials: false
							},

							// callbacks
							//
							success: (response) => {
								callback(this.dataToContacts(response));
							}
						});
					});
				}
			});
		});
	}
};