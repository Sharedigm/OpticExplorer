/******************************************************************************\
|                                                                              |
|                          add-element-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog view used to add a new lens element.            |
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
import LensFormView from '../../../../../views/apps/optic-editor/forms/elements/lens-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<%= icon %>
					</div>
					<div class="title">
						Add Element
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
						<button id="ok" class="btn btn-primary" disabled><i class="fa fa-check"></i>OK</button>
						<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-xmark"></i>Cancel</button>
					</div>
				</div>
			</div>
		</div>
	`),

	icon: `
		<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 50 512 562">
			<path d="m 103.6688,334.08496 c 0,119.18143 34.49617,215.79625 77.05269,215.79625 42.55265,0 77.05011,-96.61482 77.05011,-215.79625 0,-119.18143 -34.49746,-215.79625 -77.05011,-215.79625 -42.55652,0 -77.05269,96.61482 -77.05269,215.79625 z M 271.52554,168.2803 c 16.02674,44.88903 24.85413,103.77243 24.85413,165.80466 0,62.03223 -8.82739,120.91433 -24.85413,165.80466 -7.0964,19.87375 -15.48364,36.63374 -24.9957,49.99159 l 59.49057,0 c 42.55524,0 77.05269,-96.61482 77.05269,-215.79625 0,-119.18143 -34.49745,-215.79625 -77.05269,-215.79625 l -59.49057,0 c 9.51206,13.35785 17.8993,30.11654 24.9957,49.99159 z" />
		</svg>
	`,

	events: {
		'click #ok': 'onClickOk'
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('#ok').prop('disabled', disabled);
	},

	//
	// rendering methods
	//

	form: function() {
		return new LensFormView({
			model: this.model,
			collection: this.collection,

			// options
			//
			viewport: this.options.viewport,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	//
	// mouse event handling methods
	//
	
	onClickOk: function() {
		if (this.getChildView('form').apply()) {

			// add new lens to elements
			//
			this.collection.add(this.model, {
				at: this.model.order - 1
			});

			// clear order
			//
			this.model.order = undefined;

			// play 'add' sound
			//
			application.play('add');

			// close dialog
			//
			this.hide();
		}
	}
});