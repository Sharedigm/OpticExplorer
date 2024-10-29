/******************************************************************************\
|                                                                              |
|                             telephonic-rules.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is collection of form validation rules.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../../vendor/jquery/validate/js/jquery.validate.js';

//
// rules
//

let rules = {

	ITUE164Format: (value, element) => { 

		// allow empty values for optional fields
		//
		if (value == '') {
			return !$(element).hasClass('required');
		}

		let form = $(element).closest('form');
		let countryCode = form.find('#country-code').val();
		let areaCode = form.find('#area-code').val();
		let phoneNumber = form.find('#phone-number').val();
		let number = countryCode + areaCode + phoneNumber;
		let numberWithoutSymbols = number.replace(/\D/g,'');
		return numberWithoutSymbols.length <= 15;
	},

	phoneNumber: (value) => {
		let numberWithoutSymbols = value.replace(/\D/g,'');
		return numberWithoutSymbols.length == 7;
	},

	areaCode: (value) => {
		return value.length == 3;
	}
};

//
// add rules to validator
//

$.validator.addMethod('ITUE164Format', rules['ITUE164Format'], "Country + Area + Phone # can't be longer than 15 digits.");
$.validator.addMethod('phoneNumber', rules['phoneNumber'], "U.S. phone numbers must be 7 digits long.");
$.validator.addMethod('areaCode', rules['areaCode'], "U.S. area codes must be 3 digits long.");