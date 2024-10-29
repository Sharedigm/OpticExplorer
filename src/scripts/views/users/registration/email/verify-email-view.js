/******************************************************************************\
|                                                                              |
|                              verify-email-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view where users can verify their email                |
|        address in order to activate their accounts.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1>Verify Email Address</h1>
		
		<div class="content">
			<p>Dear <%= user.getName('single') %>, </p>
			<p>To complete your registration, press the button below.  Once you have done this, you may log in using your username and password.
			</p>
		</div>
		
		<div class="buttons">
			<button class="verify btn btn-primary btn-lg">
				<i class="fa fa-check"></i>Verify
			</button>
		</div>
	`),

	events: {
		'click .verify': 'onClickVerify'
	},

	//
	// mouse event handling methods
	//

	onClickVerify: function() {

		// verify email
		//
		this.model.verify({

			// callbacks
			//
			success: () => {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: "Email Verified",
					message: "Your email address has been verified.  You may now log in to the application using your username and password.",

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

			error: (response) => {

				// show error message
				//
				application.error({
					message: "Could not verify email.",
					response: response
				});
			}
		});
	}
});
