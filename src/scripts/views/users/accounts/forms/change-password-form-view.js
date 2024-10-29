/******************************************************************************\
|                                                                              |
|                         change-password-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view for changing a password.                     |
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

	className: 'form-horizontal narrow',

	template: template(`
		<div class="form-group">
			<label class="required control-label"><i class="normal fa fa-key"></i>Old password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required current-password form-control" autocomplete="off" maxlength="200" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Old password" data-content="This is your current password that you would like to change."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group">
			<label class="required control-label"><i class="normal fa fa-key"></i>New password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="required new-password form-control" autocomplete="off" name="password" maxlength="200" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="New password" data-content="<%= password_policy %>"></i>
					</div>
				</div>
				<div class="password-meter" style="display:none">
					<label class="password-meter-message"></label>
					<div class="password-meter-bg">
						<div class="password-meter-bar"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="form-group">
			<label class="required control-label"><i class="normal fa fa-redo"></i>Confirm password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="confirm-password form-control" autocomplete="off" name="confirm-password" maxlength="200" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Confirm password" data-content="Please retype your new password exactly as you first entered it."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'keydown .password': 'onKeydownPassword'
	},

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
			equalTo: '.new-password'
		}
	},

	messages: {
		'password': {
			required: "Enter a password."
		},
		'confirm-password': {
			required: "Re-enter your password.",
			equalTo: "Enter the same password as above."
		}
	},

	//
	// form querying methods
	//

	getCurrentPassword: function() {
		return this.$el.find('.current-password').val();
	},

	getNewPassword: function() {
		return this.$el.find('.new-password').val();
	},

	//
	// form rendering methods
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
		
		// get form values
		//
		let currentPassword = this.getCurrentPassword();
		let newPassword = this.getNewPassword();
		let confirmPassword = this.$el.find('.confirm-password').val();

		// confirm password spelling
		//
		if (newPassword == confirmPassword) {

			// perform callback
			//
			if (options && options.success) {
				options.success(currentPassword, newPassword);
			}
		} else {

			// perform callback
			//
			if (options && options.error) {
				options.error();
			}
		}

		return true;
	},

	//
	// event handling methods
	//
	
	onKeydownPassword: function(event) {
		let maxlength = $(event.currentTarget).attr('maxlength');
		if (maxlength) {
			let length = event.currentTarget.value.length;
			if (length >= maxlength) {

				// show alert message
				//
				application.alert({
					icon: '<i class="fa fa-key"></i>',
					title: "Password Length",
					message: "Your password may not exceed " + maxlength + " characters in length."
				});
			}
		}
	}
});
