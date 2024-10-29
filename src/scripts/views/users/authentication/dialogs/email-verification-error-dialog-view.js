/******************************************************************************\
|                                                                              |
|                     email-verification-error-dialog-view.js                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user with an          |
|        unverified email address tries to login.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../views/dialogs/modal-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-envelope"></i>
					</div>
					<div class="title">
						Email Verification Error
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>You are attempting to log in to an account with an unverified email address.  When you registered, you should have been sent an email containing a link to verify your email address.   Please take a look through your previous email to see if you received this email (note that it may have been diverted into a spam folder).  If you don't find it, you may click the "Resend" button below to resend it. </p>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button> 
						<button class="resend btn" data-dismiss="modal">
							<i class="fa fa-envelope"></i>Resend
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, ModalView.prototype.events, {
		'submit': 'onSubmit',
		'click .resend': 'onClickResend'
	}),

	//
	// dialog methods
	//

	accept: function() {

		// perform callback
		//
		if (this.options.accept) {
			this.options.accept();
		}

		// close dialog
		//
		this.hide();
	},

	//
	// event handling methods
	//

	onSubmit: function() {
		this.accept();

		// disable default form submission
		//
		return false;
	},

	onClickResend: function() {
		import(
			'../../../../models/users/account/email-verification.js'
		).then((EmailVerification) => {
			let emailVerification = new EmailVerification.default();
			emailVerification.resend(this.options.username, this.options.password, {

				// callbacks
				//
				success: () => {

					// show notification
					//
					application.notify({
						icon: '<i class="fa fa-envelope"></i>',
						title: "Email Verification Resent",
						message: "A new verification email has been sent to the email address that you registered with.  Please check your inbox for its arrival.  It make take a few seconds for it to arrive."
					});
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not resend email verification.",
						response: response
					});
				}
			});
		});
	}
});
