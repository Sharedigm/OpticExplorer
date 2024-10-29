/******************************************************************************\
|                                                                              |
|                           edit-event-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for adding a new user (calendar) event.         |
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
import EventFormView from '../../../../../views/apps/calendar/forms/events/event-form-view.js';

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
						Edit Event
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
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
	
	//
	// rendering methods
	//

	form: function() {
		return new EventFormView({
			model: this.model
		});
	}
});