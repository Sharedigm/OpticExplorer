/******************************************************************************\
|                                                                              |
|                          edit-topic-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a dialog view for editing an existing post topic.             |
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
import TopicFormView from '../../../../../views/apps/topic-viewer/forms/topics/topic-form-view.js';

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
						Edit Topic
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="buttons">
						<button class="save btn btn-primary" data-dismiss="modal" disabled>
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
		'click .save': 'onClickSave',
		'click .cancel': 'onClickCancel'
	}),

	//
	// dialog attributes
	//

	size: config.defaults.dialogs.sizes.small,
	resizable: true,

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.save').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	form: function() {
		return new TopicFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	//
	// mouse event handling methods
	//
	
	onClickSave: function() {
		this.getChildView('form').submit({

			// callbacks
			//
			success: (model) => {
				this.close();

				// perform callback
				//
				if (this.options.onsave) {
					this.options.onsave(model);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save topic.",
					response: response
				});
			}
		});
	},

	onClickCancel: function() {
		this.close();
	},
});
