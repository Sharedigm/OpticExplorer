/******************************************************************************\
|                                                                              |
|                            request-reset-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form that is used to create a new password reset.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import PasswordReset from '../../../../models/users/account/password-reset.js';
import FormView from '../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="username-or-email form-group">
			<label class="control-label">Username or Email</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= value %>">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Username" data-content="This is the username or email address that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'input input': 'onChange'
	},

	//
	// creating methods
	//

	createPasswordReset: function(data) {

		// create and save password reset
		//
		new PasswordReset().save(data, {
			
			// callbacks
			//
			success: () => {
				if (this.options.username) {

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-redo"></i>',
						title: "Reset Password",
						message: "Please check your inbox for an email with a link that you may use to reset your password."
					});
				} else {

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-redo"></i>',
						title: "Reset Password",
						message: "If you supplied a valid username or email address you will be sent an email with a link that you may use to reset your password."
					});
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save new password reset.",
					response: response
				});
			}
		});
	},

	//
	// getting methods
	//

	getValue: function() {
		return this.$el.find('.username-or-email input').val();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			value: this.options.username || this.options.email
		};
	},

	//
	// form submitting methods
	//

	submit: function(options) {

		// get value from form
		//
		let value = this.getValue();

		// reset password by username or email
		//
		if (!value.contains('@')) {
			this.createPasswordReset({
				'username': value
			});
		} else {
			this.createPasswordReset({
				'email': value
			});
		}

		// perform callback
		//
		if (options && options.success) {
			options.success();
		}
	}
});
