/******************************************************************************\
|                                                                              |
|                        provider-sign-in-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog that allows you to sign in using an             |
|        identity provider.                                                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../views/dialogs/modal-view.js';
import ProviderSignInFormView from '../../../../../views/users/authentication/providers/forms/provider-sign-in-form-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-sign-in-alt"></i>
					</div>
					<div class="title">
						Sign In
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="alert alert-warning alert-dismissable" style="display:none">
						<button type="button" class="close-btn btn btn-sm" data-dismiss="alert">
							<i class="fa fa-xmark"></i>
						</button>
						<label>Error: </label><span class="message">User name and password are not correct.  Please try again.</span>
					</div>
		
					<div class="sign-in-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary">
							<i class="fa fa-check"></i>OK
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
		form: '.sign-in-form'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .ok': 'onClickOk'
	}),

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('form', new ProviderSignInFormView());
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
	// focusing methods
	//

	focus: function() {

		// check that view still exists
		//
		if (this.isDestroyed()) {
			return;
		}

		// call superclass method
		//
		ModalView.prototype.focus.call(this);

		// focus on form
		//
		this.getChildView('form').focus();
	},

	//
	// mouse event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickOk: function() {

		// submit form
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: () => {
				this.hide();

				// perform callback
				//
				if (this.options.success) {
					this.options.success();
				}
			},

			error: (message) => {
				this.showWarning(message);
			}
		})) {
			this.showWarning('This form is incomplete or invalid.');
		}
	}
});
