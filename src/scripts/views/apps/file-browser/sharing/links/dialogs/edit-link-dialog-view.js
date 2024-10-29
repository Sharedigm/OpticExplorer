/******************************************************************************\
|                                                                              |
|                           edit-link-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for editing an existing link.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormDialogView from '../../../../../../views/forms/dialogs/form-dialog-view.js';
import LinkInfoFormView from '../../../../../../views/apps/file-browser/sharing/links/forms/link-info-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog" style="min-height:300px">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-pencil-alt"></i>
					</div>
					<div class="title">
						Edit Link
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="link-info-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="save btn btn-primary">
							<i class="fa fa-save"></i>Save
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
		'click .save': 'onClickSave'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.tiny,

	//
	// saving methods
	//

	save: function() {

		// create link to file
		//
		this.model.save(this.getChildView('form').getData(), {
			
			// callbacks
			//
			success: () => {

				// close dialog
				//
				this.hide();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save link.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	form: function() {
		return new LinkInfoFormView({
			model: this.model
		});
	},

	//
	// mouse event handling methods
	//

	onClickSave: function() {
		this.save();
	}
});