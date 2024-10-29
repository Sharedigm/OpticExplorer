/******************************************************************************\
|                                                                              |
|                        request-username-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to request a username.        |
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
import RequestUsernameFormView from '../../../../views/users/authentication/forms/request-username-form-view.js';

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
						Request Username
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>Please enter your email address below.  By clicking the request username button, your username will be sent via email to the account you supplied provided you are a registered user.  If you are not already a user, please register via the sign up link on the welcome page. </p>
		
					<div class="alert alert-warning alert-dismissable" style="display:none">
						<button type="button" class="close-btn btn btn-sm">
							<i class="fa fa-xmark"></i>
						</button>
						<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
					</div>
		
					<div class="request-username-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="request-username btn btn-primary" disabled>
							<i class="fa fa-envelope"></i>Request Username
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
		form: '.request-username-form'
	},
	
	events: _.extend({}, ModalView.prototype.events, {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .request-username': 'onClickRequestUsername',
		'click .cancel': 'onClickCancel'
	}),

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.request-username').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);
		
		// show child views
		//
		this.showChildView('form', new RequestUsernameFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		}));
	},

	showWarning: function(message) {	
		if (message) {
			this.$el.find('.alert-warning .message').html(message);
		}
		this.$el.find('.alert-warning .message').show();
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

	onClickRequestUsername: function() {

		// submit form
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: () => {

				// hide previously shown form warning
				//
				this.hideWarning();

				// close dialog
				//
				this.hide();
			},

			error: () => {

				// show form warning
				//
				this.showWarning();
			}
		})) {

			// show form warning
			//
			this.showWarning();
		}
	},

	onClickCancel: function() {
		if (this.options.reject) {
			this.options.reject();
		}
	}
});
