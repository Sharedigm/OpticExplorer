/******************************************************************************\
|                                                                              |
|                           place-name-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for getting information about a place.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DialogView from '../../../../../views/dialogs/dialog-view.js';
import PlaceNameFormView from '../../../../../views/apps/map-viewer/forms/info/place-name-form-view.js';

export default DialogView.extend({

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
						Place name
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p style="text-align:center">Please enter the name of this place: </p>
					<div class="form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
					<div class="buttons">
		
						<!-- general buttons -->
						<button type="submit" class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
					</div>
				</div>
			</div>
		</div>
	`),
	
	regions: {
		form: '.form'
	},

	events: {
		'click .ok': 'onClickOk'
	},
	
	//
	// dialog attributes
	//

	resizable: false,
	minimizable: false,
	maximizable: false,

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.ok').prop('disabled', disabled !== false);
	},

	//
	// rendering methods
	//

	form: function() {
		return new PlaceNameFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid)
		});
	},

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('form', this.form());

		// set initial state
		//
		this.setDisabled(true);
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {

		// perform callback
		//
		if (this.options.onsubmit) {
			this.options.onsubmit(this.getChildView('form').apply());
		}
	}
});
