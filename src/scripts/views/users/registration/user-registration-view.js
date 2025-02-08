/******************************************************************************\
|                                                                              |
|                             user-registration-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the introductory view of the application.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import User from '../../../models/users/user.js';
import UserAccount from '../../../models/users/account/user-account.js';
import EmailVerification from '../../../models/users/account/email-verification.js';
import S3Storage from '../../../models/storage/volumes/s3-storage.js';
import BaseView from '../../../views/base-view.js';
import NewUserAccountFormView from '../../../views/users/registration/forms/new-user-account-form-view.js';
import EmailVerificationView from '../../../views/users/registration/email/email-verification-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-check"></i>User Registration Form</h1>
		
		<ol class="breadcrumb">
			<li><a href="#"><i class="fa fa-home"></i>Home</li></a>
			<li><i class="fa fa-check"></i>User Registration Form</li>
		</ol>
		
		<div class="content">
			<div class="alert alert-warning alert-dismissable" style="display:none">
				<button type="button" class="close-btn btn btn-sm" data-dismiss="alert">
					<i class="fa fa-xmark"></i>
				</button>
				<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
			</div>
		
			<div class="new-user-account-form"></div>
		
			<form>
				<div class="notes">
					<span class="required"></span>Fields are required
				</div>
			</form>
		</div>
		
		<div class="buttons">
			<button type="submit" class="submit btn btn-primary btn-lg">
				<i class="fa fa-check"></i>Register
			</button>
			<% if (show_storage) { %>
			<button class="check-storage btn">
				<i class="fa fa-check"></i>Check Storage
			</button>
			<% } %>
			<button class="cancel btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button>
		</div>
	`),

	regions: {
		form: {
			el: '.new-user-account-form',
			replaceElement: true
		}
	},

	events: {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .aup': 'onClickAup',
		'click .submit': 'onClickSubmit',
		'click .check-storage': 'onClickCheckStorage',
		'click .cancel': 'onClickCancel'
	},

	//
	// constructor
	//

	initialize: function() {
		this.model = new User();
		this.account = new UserAccount();
	},

	//
	// getting methods
	//

	getStorageSettings: function() {
		return this.getChildView('form').getChildView('storage').getValues();
	},

	//
	// account creation methods
	//

	createUser: function(options) {

		// save new user form values
		//
		this.model.save(_.extend(this.getChildView('form').getValues(), {
			user_invitation_id: this.options.user_invitation? this.options.user_invitation.get('id'): null
		}), options);
	},

	//
	// verificating methods
	//

	verifyEmail: function() {

		// create a new email verification
		//
		let emailVerification = new EmailVerification({
			user_id: this.model.get('id'),
			email: this.model.get('email')
		});

		// show notify dialog
		//
		let dialog = application.notify({
			message: "Your account is being created..."
		});

		// save email verification
		//
		emailVerification.save({
			verify_route: '#register/verify-email'
		}, {
			// callbacks
			//
			success: () => {

				// close notify dialog
				//
				dialog.close();

				// show email verification page
				//
				application.showPage(new EmailVerificationView({
					model: this.model
				}));
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save email verification.",
					response: response
				});
			}
		});
	},

	check: function() {
		return this.getChildView('form').check();
	},

	//
	// form submission methods
	//

	submit: function(options) {

		// check for validity
		//
		if (this.check()) {

			// get form values
			//
			let username = this.getChildView('form').getValue('username');
			let email = this.getChildView('form').getValue('email');

			// check to see if account is valid
			//
			new UserAccount().checkValidation({
				username: username,
				email: email
			}, {

				// callbacks
				//
				success: () => {

					// check storage
					//
					if (this.hasChildView('form')) {
						this.getChildView('form').checkStorage({

							// callbacls
							//
							success: () => {
								this.createUser(options);
							},

							error: () => {
								application.error({
									message: "Storage not found."
								});
							}
						});
					} else {
						this.createUser(options);
					}
				},

				error: (response) => {
					this.showUserValidationError(JSON.parse(response.responseText));
				}
			});
		} else {

			// display error message
			//
			this.showWarning();	
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			show_storage: application.getUserStorage() == 's3'
		};
	},

	onRender: function() {

		// show child views
		//
		this.showChildView('form', new NewUserAccountFormView({
			model: this.account,
			focusable: null
		}));
	},

	showUserValidationError: function(errors) {
		import(
			'../../../views/users/authentication/dialogs/user-validation-error-dialog-view.js'
		).then((UserValidationErrorDialogView) => {

			// show user validation dialog
			//
			application.show(new UserValidationErrorDialogView.default({
				errors: errors
			}));
		});
	},

	showSignInMessage: function() {

		// show notification
		//
		application.notify({
			icon: '<i class="fa fa-user"></i>',
			title: "Account Created",
			message: "Your account has been created.  You may now log in to the application using your username and password.",

			// callbacks
			//
			accept: () => {

				// go to sign in view
				//
				application.navigate('sign-in', {
					trigger: true
				});
			}
		});
	},

	showWarning: function(message) {	
		if (message) {
			this.$el.find('.alert-warning .message').html(message);
		}
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// mouse event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},
	
	onClickAup: function() {

		// go to aup view
		//
		application.navigate('register', {
			reset: true
		});
	},

	onClickSubmit: function() {

		// submit form
		//
		this.submit({

			// callbacks
			//
			success: () => {

				// verify email
				//
				if (application.isEmailEnabled()) {
					this.verifyEmail();
				} else {
					this.showSignInMessage();
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create new user.",
					response: response
				});
			}
		});
	},

	onClickCheckStorage: function() {
		new S3Storage(this.getStorageSettings()).check({

			// callbacks
			//
			success: () => {
				application.notify({
					message: "Remote storage was accessed successfully."
				});
			},

			error: () => {
				application.notify({
					message: "Remote storage could not be found."
				});
			}
		});
	},

	onClickCancel: function() {

		// go to home view
		//
		application.navigate('', {
			trigger: true
		});
	}
});
