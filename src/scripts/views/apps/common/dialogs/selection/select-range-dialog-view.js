/******************************************************************************\
|                                                                              |
|                         select-range-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for specifying a range of lines to select.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../../views/dialogs/modal-view.js';
import SelectRangeFormView from '../../../../../views/forms/selection/select-range-form-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-select"></i>
					</div>
					<div class="title">
						Select Range
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="select-range-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
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

	regions: {
		form: '.select-range-form'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .ok': 'onClickOk'
	}),

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('form', new SelectRangeFormView(this.options));
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.getChildView('form').submit();
	}
});
