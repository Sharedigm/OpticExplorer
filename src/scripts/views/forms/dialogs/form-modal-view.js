/******************************************************************************\
|                                                                              |
|                             form-modal-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This view defines a modal that is used to display forms.              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../views/dialogs/modal-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	regions: {
		form: '.modal-body'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .save': 'onClickSave'
	}),

	//
	// querying methods
	//

	isValid: function() {
		if (this.hasChildView('form')) {
			return this.getChildView('form').isValid();
		}
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.save').prop('disabled', disabled !== false);
	},

	//
	// saving methods
	//

	save: function() {

		// disable save button
		//
		this.setDisabled(true);

		// save changes
		//
		this.getChildView('form').submit({

			// callbacks
			//
			success: (model) => {

				// close dialog
				//
				this.hide();

				// perform callback
				//
				if (this.options.onsubmit) {
					this.options.onsubmit(model);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "This item could not be saved.",
					response: response
				});
			}
		});
	},
	
	//
	// rendering methods
	//

	onRender: function() {
		
		// call superclass method
		//
		ModalView.prototype.onRender.call(this);

		// show child views
		//
		this.showForm();
	},

	showForm: function() {
		this.showChildView('form', this.form({

			// callbacks
			//
			onvalidate: (valid) => this.setDisabled(!valid),
			onchange: () => this.setDisabled(false),
			onsubmit: () => this.onSubmit()				
		}));
	},

	onShow: function() {

		// call superclass method
		//
		ModalView.prototype.onShow.call(this);

		// set initial state
		//
		this.setDisabled(!this.isValid());
	},

	//
	// mouse event handling methods
	//

	onClickSave: function() {
		this.save();
	}
});