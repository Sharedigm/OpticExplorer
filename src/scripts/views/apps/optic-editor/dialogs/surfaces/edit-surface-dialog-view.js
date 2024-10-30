/******************************************************************************\
|                                                                              |
|                          edit-surface-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an dialog used to edit a existing lens surface.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../../../../../views/dialogs/modal-view.js';
import SurfaceFormView from '../../../../../../../../../views/optics/elements/surfaces/forms/surface-form-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			<div class="modal-header">
				<div class="modal-title">
					<img class="svg" src="svg/icons/lens-icon.svg">
					<h1>Edit Surface</h1>
				</div>
			</div>
		
			<div class="modal-body"></div>
		
			<div class="modal-footer">
				<div class="notes">
					<label><span class="required"></span>Fields are required</label>
				</div>
				
				<div class="buttons">
					<button id="done" class="btn btn-primary" data-dismiss="modal" disabled><i class="fa fa-check"></i>Done</button>
					<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-xmark"></i>Cancel</button>
				</div>
			</div>
		</div>
	`),

	regions: {
		'modal-body': '.modal-body'
	},

	events: {
		'click #done': 'onClickDone'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show form view
		//
		this.showChildView('modal-body', new SurfaceFormView({
			model: this.model,

			// options
			//
			viewport: this.options.viewport,

			// callbacks
			//
			onchange: () => this.onChange()
		}));
	},

	updateButton: function() {

		// enable / disable done button
		//
		if (this.getChildView('modal-body').isValid()) {
			this.$el.find('#done').removeAttr('disabled');
		} else {
			this.$el.find('#done').attr('disabled', 'disabled');
		}
	},

	//
	// event handling methods
	//

	onChange: function() {

		// update view
		//
		this.updateButton();
	},

	onEdit: function() {

		// perform callback
		//
		if (this.options.onedit) {
			this.options.onedit();
		}
	},
	
	//
	// mouse event handling methods
	//

	onClickDone: function() {

		// update model
		//
		if (this.getChildView('modal-body').apply()) {

			// check for view changes
			//
			this.onEdit();
		}
	}
});
