/******************************************************************************\
|                                                                              |
|                        set-item-place-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog for adding a new geographical place.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../../../models/places/place.js';
import FormModalView from '../../../../../views/forms/dialogs/form-modal-view.js';
import ItemPlaceFormView from '../../../../../views/apps/file-browser/forms/places/item-place-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-map-pin"></i>
					</div>
					<div class="title">
						Set Place
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

	events: {
		'click .ok': 'onClickOk'
	},

	//
	// setting methods
	//

	setPlace: function() {

		// save changes
		//
		if (this.getChildView('form').isValid()) {
			let place = new Place(this.getChildView('form').getValues());

			// disable save button
			//
			this.$el.find('.save').prop('disabled', true);

			// set model
			//
			this.model.setPlace(place, {

				// callbacks
				//
				success: (data) => {

					// perform callback
					//
					if (this.options.onsubmit) {
						this.options.onsubmit(new Place(data));
					}
				}
			});

			// close dialog
			//
			this.hide();
		}
	},

	//
	// rendering methods
	//

	form: function() {
		return new ItemPlaceFormView({
			model: this.model,

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid),
			onchange: () => this.setDisabled(false),
			onsubmit: () => this.onSubmit()
		});
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.setPlace();
	}
});