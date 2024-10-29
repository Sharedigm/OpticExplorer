/******************************************************************************\
|                                                                              |
|                                validatable.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form validating behavior.                              |
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

export default {

	//
	// attributes
	//

	// this determines whether to revalidate on losing focus
	//
	onfocusout: undefined,

	//
	// validating methods
	//

	validate: function() {
		this.validator = this.$el.validate({
			rules: this.rules,
			messages: this.messages,
			onfocusout: this.onfocusout,
			errorPlacement: this.errorPlacement
		});
	},

	errorPlacement: function ($error, $element) {
		if ($element.closest('.input-group').length > 0) {
			$element.closest('.input-group').after($error);
		} else {
			$element.append($error);
		}
	},

	isValid: function() {
		if (this.validator) {
			// return this.validator.checkForm();
			return this.validator.form();
		} else {
			return true;
		}
	},

	check: function() {

		// trigger form updates
		//
		if (this.validator) {
			return this.validator.form();
		} else {
			return true;
		}
	}
};