/******************************************************************************\
|                                                                              |
|                         edit-object-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog used to edit an existing object.                |
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
						<%= title %>
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

	icon: '<i class="fa fa-pencil"></i>',
	title: 'Edit Object',

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
	// mouse event handling methods
	//

	onClickOk: function() {

		// update model
		//
		this.getChildView('form').apply();
	}
});