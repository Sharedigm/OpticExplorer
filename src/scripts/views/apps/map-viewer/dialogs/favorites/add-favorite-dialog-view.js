/******************************************************************************\
|                                                                              |
|                         add-favorite-dialog-view.js                          |
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

import FormModalView from '../../../../../views/forms/dialogs/form-modal-view.js';
import PlaceFormView from '../../../../../views/apps/map-viewer/forms/places/place-form-view.js';

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
						Add Favorite Place
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

	events: {
		'click .save': 'onClickSave'
	},

	//
	// saving methods
	//

	save: function() {

		// disable save button
		//
		this.$el.find('.save').prop('disabled', true);

		// save changes
		//
		this.getChildView('form').submit({

			// callbacks
			//
			success: (model) => {

				// add place to collection
				//
				this.collection.add(model);

				// perform callback
				//
				if (this.options.onadd) {
					this.options.onadd(model);
				}

				// close dialog
				//
				this.hide();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "This place could not be saved.",
					response: response
				});
			}
		});
	},
	
	//
	// rendering methods
	//

	form: function() {
		return new PlaceFormView({
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

	onClickSave: function() {
		this.save();
	}
});
