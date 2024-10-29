/******************************************************************************\
|                                                                              |
|                              contact-phone.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a contact's personal phone number.            |
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
		phone_kind: undefined,
		country_code: 1,
		area_code: undefined,
		phone_number: undefined
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

	JSONtoVCF: function(json) {
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
	},

	VCFtoJSON: function(line) {
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

		return {
			'phone_kind': kind,
			'country_code': countryCode,
			'area_code': areaCode,
			'phone_number': phoneNumber
		};
	}
});
