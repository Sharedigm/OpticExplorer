/******************************************************************************\
|                                                                              |
|                          new-contact-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a dialog for adding a new contact.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Contact from '../../../../../models/contacts/contact.js';
import FormDialogView from '../../../../../views/forms/dialogs/form-dialog-view.js';
import ContactNameFormView from '../../../../../views/apps/contact-editor/forms/contacts/contact-name-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-user"></i>
					</div>
					<div class="title">
						New Contact
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal" disabled>
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

	events: _.extend({}, FormDialogView.prototype.events, {
		'click .ok': 'onClickOk',
		'click .cancel': 'onClickCancel'
	}),

	//
	// constructor
	//

	initialize: function() {
		this.model = new Contact();
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.ok').prop('disabled', disabled !== false);
	},

	//
	// dialog methods
	//

	accept: function() {
		if (this.getChildView('form').isValid()) {

			// perform callback
			//
			if (this.options.accept) {
				this.options.accept(this.getChildView('form').apply());
			}

			// close dialog
			//
			this.close();
		}
	},

	//
	// rendering methods
	//

	form: function() {
		return new ContactNameFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	//
	// mouse event handling methods
	//
	
	onClickOk: function() {
		this.accept();
	},

	onClickCancel: function() {
		this.close();
	},
});
