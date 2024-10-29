/******************************************************************************\
|                                                                              |
|                           user-account-form-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a read-only view of the user's account information.      |
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
import DateUtils from '../../../../utilities/time/date-utils.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="username form-group">
			<label class="required control-label"><i class="normal fa fa-user"></i>Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" value="<%= username %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Username" data-content="This is the name assoociated with your user account."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="email form-group">
			<label class="required control-label"><i class="normal fa fa-envelope"></i>Email</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" placeholder="name@domain" placeholder="name@domain" value="<%= email %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Email" data-content="This is the email address assoociated with your user account."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'username':
				return this.$el.find('.username input').val();
			case 'email':
				return this.$el.find('.email input').val();
		}
	},

	hasValue: function(key) {
		return this.getValue(key) != '';
	},

	emailChanged: function() {
		if (this.hasValue('email')) {
			return this.getValue('email') != this.model.get('email');
		} else {
			return this.model.has('email');
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model,
			DateUtils: DateUtils
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
		
		// get form parameters
		//
		let username = this.getValue('username');
		let email = this.getValue('email');

		// check to see if model is valid
		//
		this.model.checkValidation({
			username: username,
			email: email
		}, {

			// callbacks
			//
			success: () => {

				// save user account
				//
				this.model.save({
					username: username,
					email: email
				}, options);
			},

			error: (response) => {
				import(
					'../../../../views/users/authentication/dialogs/user-validation-error-dialog-view.js'
				).then((UserValidationErrorDialogView) => {

					// show user validation errors dialog
					//
					application.show(new UserValidationErrorDialogView.default({
						errors: JSON.parse(response.responseText)
					}));
				});
			}
		});
	}
});