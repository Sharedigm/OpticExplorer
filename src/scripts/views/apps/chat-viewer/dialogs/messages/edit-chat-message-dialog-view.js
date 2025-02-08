/******************************************************************************\
|                                                                              |
|                        edit-chat-message-dialog-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a modal dialog box used for editing existing messages.        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormDialogView from '../../../../../views/forms/dialogs/form-dialog-view.js';
import ChatMessageFormView from '../../../../../views/apps/chat-viewer/forms/messages/chat-message-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-pencil-alt"></i>
					</div>
					<div class="title">
						Edit Message
					</div>
				</div>
			</div>
			
			<div class="modal-content">
				<div class="modal-body">
					<div class="new-message panel"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="submit btn btn-primary" disabled>
							<i class="active fa fa-save"></i>Save
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
		form: '.new-message'
	},

	events: _.extend({}, FormDialogView.prototype.events, {
		'click .submit': 'onClickSubmit'
	}),

	//
	// dialog attributes
	//
	
	resizable: true,
	minimizable: false,

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.submit').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	form: function() {
		return new ChatMessageFormView({
			model: this.model,

			// options
			//
			preferences: this.options.preferences,
			placement: 'bottom',

			// capabilities
			//
			submitable: false,
			cancelable: false,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid),
			onchange: () => this.setDisabled(false),
			onsubmit: () => this.onSubmit()
		});
	},

	onShow: function() {

		// call superclass method
		//
		FormDialogView.prototype.onShow.call(this);

		// handle form
		//
		this.getChildView('form').onShow();

		// set initial state
		//
		this.setDisabled(true);
	},
	
	//
	// form event handling methods
	//

	onSubmit: function() {

		// perform callback
		//
		if (this.options.onsubmit) {
			this.options.onsubmit();
		}
	},

	//
	// mouse event handling methods
	//

	onClickSubmit: function() {
		this.getChildView('form').submit({

			// callbacks
			//
			success: () => {

				// close dialog
				//
				this.hide();
			}
		});
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('form') && this.getChildView('form').onKeyDown) {
			this.getChildView('form').onKeyDown(event);
		}
	}
});