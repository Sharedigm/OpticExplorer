/******************************************************************************\
|                                                                              |
|                              contact-address.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a contact's personal address.                 |
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
		address_kind: undefined,
		street_address: undefined,
		apartment: undefined,
		city: undefined,
		state: undefined,
		postal_code: undefined,
		country: undefined
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
	
	//
	// getting methods
	//

	getCountryName: function() {
		let country = this.get('country');
		if (country && country.toLowerCase().contains('united states')) {
			country = 'United States';
		}
		return country;
	}
}, {

	//
	// static methods
	//

	JSONtoVCF: function(json) {
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
	},

	VCFtoJSON: function(line) {
		let pair = line.split(':');
		let value = pair[1];
		let terms = value.split(';');

		return {
			'po_box': terms[0],
			'apartment': terms[1],
			'street_address': terms[2],
			'city': terms[3],
			'state': terms[4],
			'postal_code': terms[5],
			'country': terms[6]
		};
	}
});
