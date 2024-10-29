/******************************************************************************\
|                                                                              |
|                                password-policy.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the specific password strength policy used in            |
|        this application.                                                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../vendor/jquery/validate/js/jquery.validate.js';

//
// password policy
//

/*
let MIN_CHARS = 9;
let MIXEDCASE_REQUIRED = true;
let NUMBERS_REQUIRED = true;
let SYMBOLS_REQUIRED = true;
let DESCRIPTION = "Passwords must be at least 9 characters long including one uppercase letter, one lowercase letter, one number, and one symbol.";
*/

let MIN_CHARS = 8;
let MIXEDCASE_REQUIRED = false;
let NUMBERS_REQUIRED = false;
let SYMBOLS_REQUIRED = false;
let DESCRIPTION = "Passwords must be at least 8 characters long.";

//
// attributes
//
let LOWERCASE = /[a-z]/,
	UPPERCASE = /[A-Z]/,
	DIGITS = /[0-9]/,
	SYMBOLS = /[-~`!@#$%^&*()_+=|\\[\]{ }?/.,<>;:'"]/;

//
// rating methods
//

function rating(rate, message) {
	return {
		rate: rate,
		messageKey: message
	};
}

$.validator.passwordRating = function(password, username) {

	// check for missing password
	//
	if (!password) {
		return rating(0, "too-short");
	}

	// check for invalid characters
	//
	if (!LOWERCASE.test(password) && !UPPERCASE.test(password) && !DIGITS.test(password) && !SYMBOLS.test(password)) {
		return rating(1, "invalid");
	}

	// check for password too short
	//
	if (password.length < MIN_CHARS) {
		return rating(1, "too-short");
	}

	// check for insufficient mix of characters
	//
	if (MIXEDCASE_REQUIRED && !(LOWERCASE.test(password) && UPPERCASE.test(password))) {
		return rating(1, "insufficient");
	}

	// check for insufficient mix of characters
	//
	if (NUMBERS_REQUIRED && !DIGITS.test(password)) {
		return rating(1, "insufficient");
	}

	// check for insufficient mix of characters
	//
	if (SYMBOLS_REQUIRED && !SYMBOLS.test(password)) {
		return rating(1, "insufficient");
	}

	// check for password too similar to username
	//
	if (username && password.toLowerCase().match(username.toLowerCase())) {
		return rating(0, "too-similar-to-username");
	}

	// passed!
	//
	return rating(3, "strong");
};

$.validator.passwordRating.messages = {
	"too-short": "Too short",
	"too-similar-to-username": "Too similar to username",
	"invalid": "Contains invalid characters",
	"insufficient": "Contains an insufficient mix of characters",
	"strong": "Strong"
};

export default {
	description: DESCRIPTION
};
