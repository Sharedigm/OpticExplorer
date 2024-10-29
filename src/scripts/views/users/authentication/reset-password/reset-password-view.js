/******************************************************************************\
|                                                                              |
|                               reset-password-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing the user's password.                 |
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
import ResetPasswordFormView from '../../../../views/users/authentication/forms/reset-password-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-undo"></i>Reset Password</h1>
		
		<form class="panel">
			<div class="alert alert-warning alert-dismissable" style="display:none">
				<button type="button" class="close-btn btn btn-sm" data-dismiss="alert">
					<i class="fa fa-xmark"></i>
				</button>
				<label>Error: </label><span class="message">Please try again.</span>
			</div>
		
			<p>Please enter and confirm your new password:</p>
		
			<div class="reset-password-form"></div>
			
			<div class="notes">
				<span class="required"></span>Fields are required
			</div>
		</form>
		
		<div class="buttons">
			<button class="submit btn btn-primary btn-lg">
				<i class="fa fa-check"></i>Submit
			</button>
			<button class="cancel btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button>
		</div>
	`),

	regions: {
		form: '.reset-password-form'
	},

	events: {
		'click .submit': 'onClickSubmit',
		'click .cancel': 'onClickCancel'
	},

	//
	// rendering methods
	//
	
	onRender: function() {

		// show child views
		//
		this.showChildView('form', new ResetPasswordFormView({
			model: this.model
		}));
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

	onClickSubmit: function() {

		// submit form
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: () => {

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-key"></i>',
					title: "Password Changed",
					message: "Your user password has been successfully changed.",

					// callbacks
					//
					accept: () => {

						// go to home view
						//
						application.navigate('', {
							trigger: true
						});
						window.location.reload();
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Error removing pending password reset.",
					response: response
				});
			}
		})) {

			// show form warning
			//
			this.showWarning();
		}
	},

	onClickCancel: function() {

		// go to home view
		//
		application.navigate('', {
			trigger: true
		});
		window.location.reload();
	}
});