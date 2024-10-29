/******************************************************************************\
|                                                                              |
|                         change-password-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for changing a user's password.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormModalView from '../../../../views/forms/dialogs/form-modal-view.js';
import ChangePasswordFormView from '../../../../views/users/accounts/forms/change-password-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-key"></i>
					</div>
					<div class="title">
						Change Password
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="alert alert-warning alert-dismissable" style="display:none">
						<button type="button" class="close-btn btn btn-sm" data-dismiss="alert">
							<i class="fa fa-xmark"></i>
						</button>
						<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
					</div>
		
					<div class="change-password-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
						<button class="submit btn btn-primary">
							<i class="fa fa-envelope"></i>Submit
						</button>
						<button class="cancel btn" data-dismiss="modal">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		form: '.change-password-form'
	},

	events: _.extend({}, FormModalView.prototype.events, {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .submit': 'onClickSubmit'
	}),

	changePassword: function(currentPassword, newPassword) {

		// change current user's password
		//
		this.model.changePassword(currentPassword, newPassword, {

			// callbacks
			//
			success: () => {

				// close modal dialog
				//
				this.hide();

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-key"></i>',
					title: "Password Changed",
					message: "Your user password has been successfully changed."
				});
			},

			error: (model) => {

				// show form warning
				//
				this.showWarning(model.responseText);
			}
		});
	},

	//
	// rendering methods
	//

	form: function() {
		return new ChangePasswordFormView({
			model: this.model
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

	onClickSubmit: function() {

		// submit form
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: (currentPassword, newPassword) => {

				// close dialog
				//
				this.changePassword(currentPassword, newPassword);
			},

			error: (model) => {

				// show form warning
				//
				this.showWarning(model.responseText);
			}
		})) {

			// show form warning
			//
			this.showWarning();
		}
	}
});
