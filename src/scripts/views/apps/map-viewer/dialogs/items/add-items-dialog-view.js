/******************************************************************************\
|                                                                              |
|                           add-items-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for adding photos to a map.                     |
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
import AddItemsFormView from '../../../../../views/apps/map-viewer/forms/items/add-items-form-view.js';

export default FormDialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="<%= icon || 'fa fa-image' %>"></i>
					</div>
					<div class="title">
						<%= title || "Add Photos" %>
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
	// dialog attributes
	//

	resizable: false,
	minimizable: false,
	maximizable: false,

	//
	// getting methods
	//

	getValue: function(kind) {
		return this.getChildView('form').getValue(kind);
	},

	//
	// selecting methods
	//

	select: function(value) {

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(value);
		}

		// close dialog
		//
		this.hide();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.options.icon,
			title: this.options.title
		};
	},

	form: function() {
		return new AddItemsFormView({
			description: this.options.description,

			// callbacks
			//
			onselect: (value) => {
				this.select(value);			
			}
		});
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.select(this.getValue('items-source'));
	}
});