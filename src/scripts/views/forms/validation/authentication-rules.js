/******************************************************************************\
|                                                                              |
|                          authentication-rules.js                             |
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
import '../../../utilities/security/password-policy.js';

let rules = {

	username: (value) => { 
		return typeof(value) == 'string' && /^[\u0040-\u1FE0\u2C00-\uFFC00-9 ._-]+$/i.test(value);
	},

	passwordStrongEnough: (value, element) => {
		if ($(element).attr('name') == 'confirm-password') {
			return true;
		}
		let form = $(element).closest('form');
		let username = form.find('[name="username"]').val();
		let rating = $.validator.passwordRating(value, username);
		return (rating.messageKey === 'strong');
	},

	passwordMetered: (value, element) => {
		if ($(element).attr('name') == 'confirm-password') {
			return true;
		}
		let form = $(element).closest('form');
		let username = form.find('[name="username"]').val();
		let rating = $.validator.passwordRating(value, username);

		// update meter
		//
		let meter = form.find('.password-meter', element.form);
		meter.show();
		meter.find('.password-meter-bar').removeClass().addClass('password-meter-bar')
			.addClass('password-meter-' + rating.messageKey);
		meter.find('.password-meter-message').removeClass().addClass('password-meter-message')
			.addClass('password-meter-message-' + rating.messageKey)
			.text($.validator.passwordRating.messages[rating.messageKey]);

		return (rating.messageKey === 'strong');
	},

	passwordConfirmed: (value, element) => {
		let form = $(element).closest('form');
		return value == form.find('[name="password"]').val();
	}
};

//
// add rules to validator
//

$.validator.addMethod('username', rules['username'], "Usernames must contain only letters and numbers, the period, underscore, and hyphen.");
$.validator.addMethod('passwordStrongEnough', rules['passwordStrongEnough'], "Your password must be stronger.");
$.validator.addMethod('passwordMetered', rules['passwordMetered'], "Your password must be stronger.");
$.validator.addMethod('passwordConfirmed', rules['passwordConfirmed'], "Please retype your password.");