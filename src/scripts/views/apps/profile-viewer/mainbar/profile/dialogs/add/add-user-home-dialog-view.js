/******************************************************************************\
|                                                                              |
|                          add-user-home-dialog-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a dialog for adding a home to a user's profile.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserHome from '../../../../../../../models/users/profile/user-home.js';
import FormDialogView from '../../../../../../../views/forms/dialogs/form-dialog-view.js';
import UserHomeFormView from '../../../../../../../views/apps/profile-viewer/mainbar/profile/forms/user-home-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-plus"></i>
					</div>
					<div class="title">
						Add Home
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

	resizable: false,

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormDialogView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = new UserHome();
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
		return new UserHomeFormView({
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

		// submit form
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: (model) => {
				this.close();

				// perform callback
				//
				if (this.options.onadd) {
					this.options.onadd(model);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not save user's home.",
					response: response
				});
			}
		})) {

			// disable save button
			//
			this.setDisabled(true);
		}
	},

	onClickCancel: function() {
		this.close();
	},
});
