/******************************************************************************\
|                                                                              |
|                         link-password-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view to show that a link is password protected.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../../views/dialogs/modal-view.js';
import LinkPasswordFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-password-form-view.js';

export default ModalView.extend({

	//
	// attributes
	//
	

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-lock"></i>
					</div>
					<div class="title">
						Link Password
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>This link requires a password to access. </p>
		
					<div class="alert alert-warning alert-dismissable" style="display:none">
						<button type="button" class="close-btn btn btn-sm" data-dismiss="alert">
							<i class="fa fa-xmark"></i>
						</button>
						<label>Error: </label><span class="message">Password is not correct.  Please try again.</span>
					</div>
						
					<div class="link-password-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
						<button class="submit btn btn-primary">
							<i class="fa fa-key"></i>Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		form: '.link-password-form'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .alert .close-btn': 'onClickAlertClose',
		'click .submit': 'onClickSubmit'
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
		this.showChildView('form', new LinkPasswordFormView({
			model: this.model
		}));
	},

	showDirectory: function(directory, options) {
		import(
			'../../../../../../views/apps/file-browser/file-browser-view.js'
		).then((FileBrowserView) => {

			// show file browser
			//
			application.show(new FileBrowserView.default({
				model: directory
			}), options);
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
			success: (link) => {

				// close dialog
				//
				this.close({

					// calblacks
					//
					done: () => {
						if (this.options.success) {
							this.options.success(link);
						}
					}
				});
			}, 

			error: (error) => {

				// invalid password
				//
				this.showWarning(error);
			}
		})) {

			// validation error
			//
			this.showWarning();
		}
	}
});
