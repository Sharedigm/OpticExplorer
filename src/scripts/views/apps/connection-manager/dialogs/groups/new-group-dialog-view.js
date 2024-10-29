/******************************************************************************\
|                                                                              |
|                           new-group-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a dialog view for adding a new post topic.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Group from '../../../../../models/users/connections/group.js';
import FormModalView from '../../../../../views/forms/dialogs/form-modal-view.js';
import GroupFormView from '../../../../../views/apps/connection-manager/forms/groups/group-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-users"></i>
					</div>
					<div class="title">
						New Group
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

	events: _.extend({}, FormModalView.prototype.events, {
		'click .save': 'onClickSave',
		'click .cancel': 'onClickCancel'
	}),

	//
	// dialog attributes
	//

	resizable: false,
	
	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormModalView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = new Group();
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
		return new GroupFormView({
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
			success: (attributes) => {
				this.model.set(attributes);
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
					message: "Could not save new group.",
					response: response
				});
			}
		});
	},

	onClickCancel: function() {
		this.close();
	},
});