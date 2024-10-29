/******************************************************************************\
|                                                                              |
|                           new-user-account-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a new user's account            |
|        information.                                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserAccount from '../../../../models/users/account/user-account.js';
import FormView from '../../../../views/forms/form-view.js';
import PasswordPolicy from '../../../../utilities/security/password-policy.js';
import S3VolumeFormView from '../../../../views/apps/file-browser/forms/volumes/s3-volume-form-view.js';
import '../../../../views/forms/validation/authentication-rules.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<fieldset>
			<legend>Profile</legend>

			<div class="name form-group">
				<label class="required control-label"><i class="fa fa-quote-left"></i>Name</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required form-control" name="name" value="<%= name %>" />
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Name" data-content="This is your full name."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>

		<fieldset>
			<legend>Account</legend>
		
			<div class="username form-group">
				<label class="required control-label"><i class="fa fa-user"></i>Username</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required form-control" name="username" value="<%= username %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Username" data-content="Your username is the name that you use to sign in to the web site."></i>
						</div>
					</div>
				</div>
			</div>
		
			<div class="password form-group">
				<label class="required control-label"><i class="fa fa-key"></i>Password</label>
				<div class="controls">
					<div class="input-group">
						<input type="password" class="required form-control" autocomplete="off" name="password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Password" data-content="<%= password_policy %>"></i>
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
		
			<div class="confirm-password form-group">
				<label class="required control-label"><i class="fa fa-redo"></i>Confirm PW</label>
				<div class="controls">
					<div class="input-group">
						<input type="password" class="required form-control" autocomplete="off" name="confirm-password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Confirm password" data-content="Please retype your new password exactly as you first entered it."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
		
		<% if (show_verify) { %>
		<fieldset>
			<legend>Verification</legend>
		
			<div class="email form-group">
				<label class="required control-label"><i class="fa fa-envelope"></i>Email</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required email form-control" name="email" placeholder="name@domain" value="<%= email %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Email" data-content="A valid email address is required and will be used for your account registration and for password recovery."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="confirm-email form-group">
				<label class="required control-label"><i class="fa fa-redo"></i>Confirm email</label>
				<div class="controls">
					<div class="input-group">
						<input type="text" class="required confirm-email form-control" name="confirm-email" placeholder="name@domain" value="<%= email %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" title="Confirm email address" data-content="Please retype your previously entered email address for verification."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
		<% } %>

		<% if (show_storage) { %>
		<fieldset>
			<legend>Storage</legend>
			<div class="storage"></div>
		</fieldset>
		<% } %>
	`),

	regions: {
		'storage': {
			el: '.storage',
			replaceElement: true
		}
	},

	events: {
		'click .generate': 'onClickGenerate',
		'blur .email input': 'onBlurEmail',
		'blur .username input': 'onBlurUsername'
	},

	//
	// form attributes
	//

	showPasswordMeter: false,

	//
	// form attributes
	//

	rules: {
		'name': {
			required: true
		},
		'username': {
			required: true,
			username: true						
		},
		'confirm-email': {
			required: true,
			equalTo: '.email input'
		},
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
		'email': {
			required: "Enter a valid email address.",
			email: "This email address is not valid."
		},
		'confirm-email': {
			required: "Re-enter your email address.",
			equalTo: "Retype the email address above."
		},
		'username': {
			required: "Enter a username / login.",
			minlength: $.validator.format("Enter at least {0} characters.")
		},
		'password': {
			required: "Enter a password.",
			passwordStrongEnough: "Your password must be stronger."
		},
		'confirm-password': {
			required: "Re-enter your password.",
			equalTo: "Enter the same password as above."
		}
	},

	//
	// ajax methods
	//

	checkStorage: function(options) {

		// check storage form
		//
		if (this.hasChildView('storage')) {
			this.getChildView('storage').checkStorage(options);
		} else {

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}
		}
	},

	//
	// querying methods
	//

	isValid: function() {

		// check user form
		//
		if (!FormView.prototype.isValid.call(this)) {
			return false;
		}

		// check storage form
		//
		if (this.hasChildView('storage')) {
			if (!this.getChildView('storage').isValid()) {
				return false;
			}
		}

		return true;
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'name':
				return this.$el.find('.name input').val();
			case 'email':
				return this.$el.find('.email input').val();
			case 'username':
				return this.$el.find('.username input').val();
			case 'password':
				return this.$el.find('.password input').val();
		}
	},

	getNames: function() {

		// split names into first, middle, last
		//
		let name = this.getValue('name');
		let names = name.split(' ');
		let first_name, preferred_name, middle_name, last_name;

		// last name only
		//
		if (names.length == 1) {
			last_name = names[length];

		// first and last names
		//
		} else if (names.length == 2) {
			first_name = names[0];
			last_name = names[1];

		// first, preferred or middle, and last names
		//
		} else if (names.length == 3) {
			first_name = names[0];
			if (names[1].startsWith('(')) {
				preferred_name = names[1].replace('(', '').replace(')', '');
			} else {
				middle_name = names[1];
			}
			last_name = names[2];

		// first, preferred, middle (multiple), and last names
		//
		} else {
			first_name = names[0];
			if (names[1].startsWith('(')) {
				preferred_name = names[1].replace('(', '').replace(')', '');
				middle_name = names.slice(2, -1).join(' ');
			} else {
				middle_name = names.slice(1, -1).join(' ');
			}
			last_name = names[names.length - 1];
		}

		return {
			first_name: first_name,
			preferred_name: preferred_name,
			middle_name: middle_name,
			last_name: last_name
		};
	},

	getStorage: function() {
		if (this.hasChildView('storage')) {
			return this.getChildView('storage').getValues();
		} else {
			return {};
		}
	},

	getValues: function() {
		return _.extend(this.getNames(), {
			email: this.getValue('email'),
			username: this.getValue('username'),
			password: this.getValue('password')
		}, this.getStorage());
	},

	//
	// username getting methods
	//

	getRandomUsername: function() {

		// propose a username by appending a 5 digit random number to 'swamp'
		//
		return 'swamp' + Math.round(10000 + Math.random() * 90000);
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			model: this.model,
			password_policy: PasswordPolicy.description,
			show_verify: application.isEmailEnabled(),
			show_storage: application.getUserStorage() == 's3'
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show storage form
		//
		if (application.getUserStorage() == 's3') {
			this.showChildView('storage', new S3VolumeFormView());
		}
	},

	//
	// mouse event handling methods
	//

	onClickGenerate: function(event) {

		// set username to generated value
		//
		this.$el.find('#username').val(this.getRandomUsername());

		// block event from parent
		//
		this.block(event);	
	},

	onBlurUsername: function(event) {
		let username = event.currentTarget.value;
		if (username !== '' && username !== ' ') {

			// check for username uniqueness
			//
			new UserAccount().checkValidation({
				username: username
			}, {

				// callbacks
				//
				error: (response) => {
					let error = JSON.parse(response.responseText)[0];
					error = error.substr(0,1).toUpperCase() + error.substr(1);
					this.$el.validate().showLabel($('.username input')[0], error);
				}
			});
		}
	},

	onBlurEmail: function(event) {
		let email = event.currentTarget.value;
		if (email !== '' && email !== ' ') {

			// check for username uniqueness
			//
			new UserAccount().checkValidation({
				email: email,
			}, {

				// callbacks
				//
				error: (response) => {
					let error = JSON.parse(response.responseText)[0];
					error = error.substr(0,1).toUpperCase() + error.substr(1);
					this.$el.validate().showLabel($('.email input')[0], error);
				}
			});
		}
	}
});