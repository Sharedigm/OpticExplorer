/******************************************************************************\
|                                                                              |
|                         reset-password-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog box that is used to reset a password.          |
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
import RequestResetFormView from '../../../../views/users/authentication/forms/request-reset-form-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-undo"></i>
					</div>
					<div class="title">
						Reset Password
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>Please enter your username or email address below. After clicking the Request Reset button an email will be sent to your registered email address containing a link to reset your password.</p>
		
					<div class="alert alert-warning alert-dismissable" style="display:none">
						<button type="button" class="close-btn btn btn-sm">
							<i class="fa fa-xmark"></i>
						</button>
						<label>Error: </label><span class="message">You must supply either a username or an email address to reset your password.</span>
					</div>
		
					<div class="request-reset-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="submit btn btn-primary"<% if (disabled) { %>disabled<% } %>>
							<i class="fa fa-envelope"></i>Request Reset
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
		form: '.request-reset-form'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .submit': 'onClickSubmit',
		'click .cancel': 'onClickCancel'
	}),

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.submit').prop('disabled', disabled !== false);
	},

	//
	// dialog methods
	//

	submit: function() {

		// submit form
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: () => {
				this.hideWarning();

				// perform callback
				//
				if (this.options.accept) {
					this.options.accept();
				}

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

	cancel: function() {

		// perform calllback
		//
		if (this.options.reject) {
			this.options.reject();
		}

		// close dialog
		//
		this.hide();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			disabled: this.options.username == undefined || this.options.username == ''
		};
	},

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('form', new RequestResetFormView({
			model: this.model,

			// options
			//
			username: this.options.username,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
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

	onClickAlertClose: function() {
		this.hideWarning();
	},
	
	onClickSubmit: function() {
		this.submit();
	},

	onClickCancel: function() {
		this.cancel();
	}
});
