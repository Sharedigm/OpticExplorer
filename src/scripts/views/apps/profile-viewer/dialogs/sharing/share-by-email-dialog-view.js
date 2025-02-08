/******************************************************************************\
|                                                                              |
|                         share-by-email-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for sharing an item via email.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../../../views/dialogs/dialog-view.js';
import EmailFormView from '../../../../../views/apps/profile-viewer/forms/mail/email-form-view.js';

export default DialogView.extend({

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
						Share by Email
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="email-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
						<button class="send btn btn-primary"<% if (options['send-as'] == 'link') { %> style="display:none"<% } %>>
							<i class="fa fa-envelope"></i>Send
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
		email: {
			el: '.email-form',
			replaceElement: true
		},
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .send': 'onClickSend'
	}),

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.send').prop('disabled', disabled !== false);
	},

	//
	// sending methods
	//

	sendMail: function(data) {
		this.model.sendByMail({
			data: data,

			// callbacks
			//
			success: () => {

				// play send sound
				//
				application.play('send');

				// close dialog
				//
				this.hide();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not send email.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			options: this.options
		};
	},

	onRender: function() {

		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showEmailForm();

		// set initial state
		//
		this.setDisabled(true);
	},

	showEmailForm: function() {
		this.showChildView('email', new EmailFormView({
			model: this.model,

			// options
			//
			to: undefined,
			cc: undefined,
			subject: this.model.getName(),
			message: "Here is a link to " + this.model.getName() + "'s public home page: " + '\n' +
				this.model.getUrl(),

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSend: function() {
		let form = this.getChildView('email');

		// check form validation
		//
		if (form.isValid()) {
			this.sendMail(form.getValues());
		} else {
			this.setDisabled(true);
		}
	}
});