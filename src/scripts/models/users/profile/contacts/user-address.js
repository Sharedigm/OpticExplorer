/******************************************************************************\
|                                                                              |
|                               user-address.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal address.                    |
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
		address_kind: undefined,
		street_address: undefined,
		apartment: undefined,
		city: undefined,
		state: undefined,
		postal_code: undefined,
		country: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/addresses',

	//
	// getting methods
	//

	getCountryName: function() {
		let country = this.get('country');
		if (country && country.toLowerCase().contains('united states')) {
			country = 'United States';
		}
		return country;
	},

	//
	// converting methods
	//

	toString: function() {
		let line = '';

		line += this.has('street_address')? this.get('street_address') : '';
		line += this.has('city')? ', ' + this.get('city') : '';
		line += this.has('state')? ' ' + this.get('state') : '';
		line += this.has('postal_code')? ', ' + this.get('postal_code') : '';
		line += this.has('country')? ', ' + this.get('country'): '';
		
		return line;
	},

	toContactInfo: function() {
		let json = {};

		if (this.has('address_kind')) {
			json.address_kind = this.get('address_kind');
		}

		json.po_box = this.get('po_box');
		json.apartment = this.get('apartment');
		json.street_address = this.get('street_address');
		json.city = this.get('city');
		json.state = this.get('state');
		json.postal_code = this.get('postal_code');
		json.country = this.get('country');
		
		return json;
	},

	toVCF: function() {
		let line = '';
		line += 'ADR';

		if (this.has('address_kind')) {
			line += ';TYPE=' + this.get('address_kind');
		}

		line += ':';
		line += (this.get('po_box') || '') + ';';
		line += (this.get('apartment') || '') + ';';
		line += (this.get('street_address') || '') + ';';
		line += (this.get('city') || '') + ';';
		line += (this.get('state') || '') + ';';
		line += (this.get('postal_code') || '') + ';';
		line += (this.get('country') || '');
		
		return line;
	},

	fromVCF: function(line) {
		let pair = line.split(':');
		let value = pair[1];
		let terms = value.split(';');

		// set attributes
		//
		this.set({
			'po_box': terms[0],
			'apartment': terms[1],
			'street_address': terms[2],
			'city': terms[3],
			'state': terms[4],
			'postal_code': terms[5],
			'country': terms[6]
		});

		return this;
	}
}, {

	//
	// static methods
	//

	toVCF: function(json) {
		let line = '';
		line += 'ADR';

		if (json.address_kind) {
			line += ';TYPE=' + json.address_kind;
		}

		line += ':';
		line += (json.po_box || '') + ';';
		line += (json.apartment || '') + ';';
		line += (json.street_address || '') + ';';
		line += (json.city || '') + ';';
		line += (json.state || '') + ';';
		line += (json.postal_code || '') + ';';
		line += (json.country || '');
		
		return line;
	}
});
