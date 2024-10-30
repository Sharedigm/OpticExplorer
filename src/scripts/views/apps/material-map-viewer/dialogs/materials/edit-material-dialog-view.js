/******************************************************************************\
|                                                                              |
|                           edit-material-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view used to edit a material.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FormModalView from '../../../../../views/forms/dialogs/form-modal-view.js';
import MaterialFormView from '../../../../../views/apps/material-map-viewer/forms/materials/material-form-view.js';

export default FormModalView.extend({

	//
	// rendering attributes
	//

	template: template(`
		<div class="modal-dialog">
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-gem"></i>
					</div>
					<div class="title">
						Edit Material
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
			
				<div class="modal-footer">
					<div class="notes">
						<label><span class="required"></span>Fields are required</label>
					</div>
			
					<div class="buttons">
						<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button>
						<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-xmark"></i>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: {
		'click #ok': 'onClickOk'
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('#ok').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	form: function() {
		return new MaterialFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {

		// set model attributes
		//
		if (this.getChildView('form').apply()) {

			// perform callback
			//
			if (this.options.onsubmit) {
				this.options.onsubmit(this.model);
			}
		}
	}
});
