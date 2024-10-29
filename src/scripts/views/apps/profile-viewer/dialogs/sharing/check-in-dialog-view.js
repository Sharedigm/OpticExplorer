/******************************************************************************\
|                                                                              |
|                            check-in-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for checking in.                                |
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
import CheckInFormView from '../../../../../views/apps/profile-viewer/forms/check-in-form-view.js';

export default FormDialogView.extend({
	
	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-map-marker-alt"></i>
					</div>
					<div class="title">
						Check In
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary">
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
		'click .ok': 'onClickOk'
	}),

	//
	// rendering methods
	//

	form: function() {
		return new CheckInFormView({
			model: this.model
		});
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
	}
});
