/******************************************************************************\
|                                                                              |
|                           new-project-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a dialog view for adding a new post project.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Project from '../../../../../models/projects/project.js';
import FormDialogView from '../../../../../views/forms/dialogs/form-dialog-view.js';
import ProjectFormView from '../../../../../views/apps/project-browser/forms/projects/project-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-clipboard"></i>
					</div>
					<div class="title">
						New Project
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
				
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
		
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
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormDialogView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = new Project();
	},

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
		return new ProjectFormView({
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
			success: () => {
				this.close();

				// perform callback
				//
				if (this.options.onsave) {
					this.options.onsave(this.model);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save new project.",
					response: response
				});
			}
		});
	},

	onClickCancel: function() {
		this.close();
	}
});
