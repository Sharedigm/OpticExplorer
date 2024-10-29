/******************************************************************************\
|                                                                              |
|                            reset-password-form-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for resetting a user's password.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import PasswordPolicy from '../../../../utilities/security/password-policy.js';
import '../../../../views/forms/validation/authentication-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="password form-group">
			<label class="required control-label"><i class="normal fa fa-key"></i>New password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="off" name="password" maxlength="200">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="New password" data-content="<%= password_policy %>"></i>
					</div>
				</div>
			</div>
		</div> 
		
		<div class="confirm-password form-group">
			<label class="required control-label"><i class="normal fa fa-redo"></i>Confirm password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required form-control" autocomplete="off" name="confirm-password" maxlength="200">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Confirm password" data-content="Please retype your new password exactly as you first entered it."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// form attributes
	//

	rules: {
		'password': {
			required: true,
			passwordStrongEnough: true
		},
		'confirm-password': {
			required: true,
			equalTo: '.password input'
		}
	},

	messages: {
		'password': {
			required: "Enter a password"
		},
		'confirm-password': {
			required: "Re-enter your password",
			equalTo: "Enter the same password as above"
		}
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'password':
				return this.$el.find('.password input').val();
			case 'confirmation':
				return this.$el.find('.confirm-password input').val();
		}
	},

	getValues: function() {
		return {
			password: this.getValue('password'),
			confirmation: this.getValue('confirmation')
		};
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			password_policy: PasswordPolicy.DESCRIPTION,
		};
	},

	//
	// form submission methods
	//

	submit: function(options) {

		// check form validation
		//
		if (!this.isValid()) {
			return false;
		}
		
		let values = this.getValues();

		// confirm password spelling
		//
		if (values.password !== values.confirmation) {
			this.$el.find('.error').html("Passwords do not match.");
			this.$el.find('.alert').show();
			return;
		}

		// change password
		//
		this.model.reset(values.password, options);

		return true;
	}
});