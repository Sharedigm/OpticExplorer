/******************************************************************************\
|                                                                              |
|                             sign-in-form-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form used to sign in to the application.               |
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

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="username form-group">
			<label class="control-label"><i class="normal fa fa-user"></i>Username</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" autocomplete="username">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Username" data-content="This is the username that you specified when you registered."></i>
					</div>
				</div>
				<div class="fineprint"><a class="request-username"><i class="normal fa fa-envelope"></i> Request my username</a></div>
			</div>
		</div>
		
		<div class="password form-group">
			<label class="control-label"><i class="normal fa fa-key"></i>Password</label>
			<div class="controls">
				<div class="input-group">
					<input type="password" class="form-control" maxlength="200" autocomplete="current-password">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Password" data-content="This is the password that you specified when you registered."></i>
					</div>
				</div>
				<div class="fineprint"><a class="reset-password"><i class="normal fa fa-undo"></i> Reset my password</a></div>
			</div>
		</div>
	`),

	events: {
		'click .reset-password': 'onClickResetPassword',
		'click .request-username': 'onClickRequestUsername'
	},

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'username':
				return this.$el.find('.username input').val();
			case 'password':
				return this.$el.find('.password input').val();
		}
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
		let username = this.getValue('username');
		let password = this.getValue('password');

		// send login request
		//
		return application.session.login(username, password, {
			crossDomain: true,

			// callbacks
			//
			success: () => {

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			},

			error: (response) => {
				if (response.status == 403) {
					window.location = application.getUrl() + 'block/index.html';
				} else if (response.status != 500) {
					if (response.responseText == "User email has not been verified.") {
						this.showEmailVerificationError(username, password);
					} else if (response.responseText == '') {
						options.error("Log in request failed. It appears that you may have lost internet connectivity.  Please check your internet connection and try again.");
					} else {
						options.error(response.responseText);
					}
				} else {
					options.error("Log in request failed.");
				}
			}
		});
	},

	showEmailVerificationError: function(username, password) {
		import(
			'../../../../views/users/authentication/dialogs/email-verification-error-dialog-view.js'
		).then((EmailVerificationErrorDialogView) => {

			// show email verification dialog
			//
			application.show(new EmailVerificationErrorDialogView.default({
				username: username,
				password: password
			}));
		});
	},

	//
	// mouse event handling methods
	//

	onClickResetPassword: function() {
		import(
			'../../../../views/users/authentication/dialogs/request-reset-dialog-view.js'
		).then((RequestResetDialogView) => {

			// close dialog
			//
			this.parent.hide();

			// show request password reset dialog
			//
			application.show(new RequestResetDialogView.default({
				username: this.getValue('username')
			}));
		});
	},

	onClickRequestUsername: function() {
		import(
			'../../../../views/users/authentication/dialogs/request-username-dialog-view.js'
		).then((RequestUsernameDialogView) => {

			// close dialog box
			//
			this.parent.hide();
			
			// show request username dialog
			//
			application.show(new RequestUsernameDialogView.default());
		});
	}
});
