/******************************************************************************\
|                                                                              |
|                           add-event-dialog-view.js                           |
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

import UserEvent from '../../../../../models/events/user-event.js';
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
						<i class="fa fa-plus"></i>
					</div>
					<div class="title">
						Add Event
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
	// constructor
	//

	initialize: function() {
		this.model = new UserEvent();
	},

	//
	// rendering methods
	//

	form: function(options) {
		return new EventFormView(_.extend({
			model: this.model
		}, options));
	}
});
