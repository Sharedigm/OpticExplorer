/******************************************************************************\
|                                                                              |
|                            alphanumeric-rules.js                             |
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

let rules = {

	//
	// alphabetic rules
	//

	alphaOnly: (value) => {
		return (/^[-\sa-zA-Z]+$/.test(value));
	},

	alphanumericOnly: (value) => {
		return (/^[0-9\sa-zA-Z]+$/.test(value));
	},

	//
	// numeric rules
	//

	numericOnly: (value) => {
		return (/^[0-9]+$/.test(value));
	},

	numericOrDashesOnly: (value) => {
		return (/^[0-9,-]+$/.test(value));
	},

	integer: (value) => {
		let floatVal = parseFloat(value);
		return (floatVal == Math.floor(floatVal));
	},

	positive: (value) => {
		return parseFloat(value) > 0;
	},

	nonzero: (value) => {
		return parseFloat(value) != 0;
	},

	//
	// digit rules
	//

	oneDigit: (value) => {
		return value && value.length == 1;
	},

	twoDigits: (value) => {
		return value && value.length == 2;
	},

	threeDigits: (value) => {
		return value && value.length == 3;
	},

	fourDigits: (value) => {
		return value && value.length == 4;
	},

	fiveDigits: (value) => {
		return value && value.length == 5;
	}
};

//
// add rules to validator
//

$.validator.addMethod('alphaOnly', rules['alphaOnly'], "Please only enter alphabet characters (letters, hyphens, and spaces).");
$.validator.addMethod('alphaumericOnly', rules['alphanumericOnly'], "Please only enter alphabet characters (letters, hyphens, and spaces) or numbers.");

$.validator.addMethod('numericOnly', rules['numericOnly'], "Please only enter numeric values (0-9).");
$.validator.addMethod('numericOrDashesOnly', rules['numericOrDashesOnly'], "Please only enter numeric values (0-9) or dashes");
$.validator.addMethod('integer', rules['integer'], "Please enter an integer value.");
$.validator.addMethod('positive', rules['positive'], "Please enter a positive value.");
$.validator.addMethod('nonzero', rules['nonzero'], "Please enter a non-zero value.");

$.validator.addMethod('oneDigit', rules['oneDigit'], "Please enter a one digit number.");
$.validator.addMethod('twoDigits', rules['twoDigits'], "Please enter a two digit number.");
$.validator.addMethod('threeDigits', rules['threeDigits'], "Please enter a three digit number.");
$.validator.addMethod('fourDigits', rules['fourDigits'], "Please enter a four digit number.");
$.validator.addMethod('fiveDigits', rules['fiveDigits'], "Please enter a five digit number.");