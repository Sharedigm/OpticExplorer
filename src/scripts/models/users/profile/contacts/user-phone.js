/******************************************************************************\
|                                                                              |
|                                user-phone.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user's personal phone.                      |
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
		phone_kind: undefined,
		country_code: 1,
		area_code: undefined,
		phone_number: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/users/phones',

	//
	// converting methods
	//

	toString: function() {
		if (this.has('area_code')) {
			return '(' + this.get('area_code') + ') ' + this.get('phone_number');
		} else {
			return this.get('phone_number');
		}
	},

	toContactInfo: function() {
		let json = {};

		if (this.has('phone_kind')) {
			json.phone_kind = this.get('phone_kind');
		}
		
		json.country_code = this.get('country_code');
		json.area_code = this.get('area_code');
		json.phone_number = this.get('phone_number');
		
		return json;
	},

	toVCF: function() {
		let line = '';
		line += 'TEL';

		if (this.has('phone_kind')) {
			line += ';TYPE=' + this.get('phone_kind');
		}
		
		line += ':';
		line += (this.get('country_code') || '') + ' (';
		line += (this.get('area_code') || '') + ') ';
		line += (this.get('phone_number') || '');
		
		return line;
	},

	fromVCF: function(line) {
		let pair = line.split(':');
		let key = pair[0];
		let value = pair[1];
		let terms = value.split(' ');
		let kind, countryCode, areaCode, phoneNumber;

		// parse phone number type
		//
		if (key.contains('TYPE=')) {
			pair = key.split('TYPE=');
			kind = pair[1].toLowerCase();

			if (kind.contains('mobile')) {
				kind = 'mobile';
			} else if (kind.contains('home')) {
				kind = 'home';
			} else if (kind.contains('work')) {
				kind = 'work';
			}
		}

		// parse phone number terms
		//
		if (terms.length == 3) {
			countryCode = terms[0];
			areaCode = terms[1];
			phoneNumber = terms[2];
		} else if (terms.length == 2) {
			areaCode = terms[0];
			phoneNumber = terms[1];
		} else {
			phoneNumber = terms[0];
		}

		// trim parens from area code
		//
		if (areaCode) {
			areaCode = areaCode.ltrim('(').rtrim(')');
		}

		// set attributes
		//
		this.set({
			'phone_kind': kind,
			'country_code': countryCode,
			'area_code': areaCode,
			'phone_number': phoneNumber
		});

		return this;
	}
}, {

	//
	// static methods
	//

	parse: function(string) {
		let areaCode, phoneNumber;

		if (string.contains(')')) {
			let pair = string.split(')');
			areaCode = pair[0].replace(/\(/g, '').replace(/\)/g).trim();
			phoneNumber = pair[1].trim();
		} else {
			phoneNumber = string;
		}

		return {
			area_code: areaCode,
			phone_number: phoneNumber
		};
	},

	toVCF: function(json) {
		let line = '';
		line += 'TEL';

		if (json.phone_kind) {
			line += ';TYPE=' + json.phone_kind;
		}
		
		line += ':';
		line += (json.country_code || '') + ' (';
		line += (json.area_code || '') + ') ';
		line += (json.phone_number || '');
		
		return line;	
	}
});
