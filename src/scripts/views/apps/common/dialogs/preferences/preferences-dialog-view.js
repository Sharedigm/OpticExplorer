/******************************************************************************\
|                                                                              |
|                           preferences-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for specifying user preferences.                |
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

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-snowflake"></i>
					</div>
					<div class="title">
						Preferences
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
						<button class="reset btn">
							<i class="fa fa-undo"></i>Reset
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
		'click .reset': 'onClickReset',
		'click .cancel': 'onClickCancel'
	}),

	//
	// dialog attributes
	//

	minimizable: false,

	//
	// deleting methods
	//

	deleteAll: function(options) {

		// check if we need to confirm
		//
		if (!options || options.confirm != false) {

			// confirm delete
			//
			application.confirm({
				title: "Delete Preferences",
				message: "Are you sure you want to delete your user preferences for this app?",

				// callbacks
				//
				accept: () => {
					this.model.delete(options);
				}
			});
		} else {

			// delete user preferences for this app
			//
			this.model.delete(options);
		}
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {

		// save preferences
		//
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

	onClickReset: function() {

		// delete user preferences for this app
		//
		this.deleteAll({

			// callbacks
			//
			success: () => {

				// reset to default preferences
				//
				this.model.reset();

				// reset app
				//
				this.parent.reset();

				// dismiss dialog
				//
				this.hide();
			}
		});
	},

	onClickCancel: function() {

		// check if form values have changed
		//
		if (this.getChildView('form').hasChanged()) {

			// revert to previous settings
			//
			this.opener.setOptions(this.getChildView('form').getOriginalValues());
		}
	}
});
