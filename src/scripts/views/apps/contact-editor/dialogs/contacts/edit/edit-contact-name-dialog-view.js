/******************************************************************************\
|                                                                              |
|                       edit-contact-name-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for editing an user's contact name.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormModalView from '../../../../../../views/forms/dialogs/form-modal-view.js';
import ContactNameFormView from '../../../../../../views/apps/contact-editor/forms/contacts/contact-name-form-view.js';

export default FormModalView.extend({

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
						Edit Contact Name
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
						<button class="cancel btn">
							<i class="fa fa-xmark"></i>Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, FormModalView.prototype.events, {
		'click .ok': 'onClickOk',
		'click .cancel': 'onClickCancel'
	}),

	//
	// rendering methods
	//

	form: function() {
		return new ContactNameFormView({
			model: this.model
		});
	},

	//
	// event handling methods
	//
	
	onClickOk: function() {

		// update model
		//
		this.model.set(this.getChildView('form').getValues());
		this.close();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(this.model);
		}
	},

	onClickCancel: function() {
		this.close();
	},
});
