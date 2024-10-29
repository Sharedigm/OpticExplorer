/******************************************************************************\
|                                                                              |
|                         request-username-form-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form that is used to request a username.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import User from '../../../../models/users/user.js';
import FormView from '../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="email-address form-group">
			<label class="control-label"><i class="fa fa-envelope"></i>Email</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Email" data-content="This is the email address that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'input input': 'onChange'
	},

	//
	// requesting methods
	//

	requestUsernameByEmail: function(email) {
		let user = new User();

		// find user by username
		//
		user.requestUsernameByEmail(email, {

			// callbacks
			//
			success: () => {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: "Username Requested",
					message: "If the email address you submitted matches a valid account, an email containing your username will be sent."
				});
			},
	
			error: (response) => {

				// show error message
				//
				application.error({
					message: "Could not request username.",
					response: response
				});
			}
		});
	},

	//
	// form querying methods
	//

	getEmailAddress: function() {
		return this.$el.find('.email-address input').val();
	},

	//
	// form submitting methods
	//

	submit: function(options) {

		// get form values
		//
		let email = this.getEmailAddress();
		
		if (email) {
			this.requestUsernameByEmail(email);
		} else {

			// show alert message
			//
			application.alert({
				icon: '<i class="fa fa-user"></i>',
				title: "Request Username",
				message: "You must supply a user name or email address."
			});
		}

		// perform callback
		//
		if (options && options.success) {
			options.success();
		}
	}
});
