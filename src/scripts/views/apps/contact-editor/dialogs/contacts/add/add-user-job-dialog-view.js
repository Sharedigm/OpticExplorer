/******************************************************************************\
|                                                                              |
|                          add-user-job-dialog-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a dialog for adding a job to a user's profile.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserJob from '../../../../../../models/users/profile/user-job.js';
import FormModalView from '../../../../../../views/forms/dialogs/form-modal-view.js';
import UserJobFormView from '../../../../../../views/apps/contact-editor/forms/contacts/user-job-form-view.js';

export default FormModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-plus"></i>
					</div>
					<div class="title">		
						Add Affiliation
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body"></div>
				
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal" disabled>
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

	events: _.extend({}, FormModalView.prototype.events, {
		'click .ok': 'onClickOk',
		'click .cancel': 'onClickCancel'
	}),

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		FormModalView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = new UserJob();
	},

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
		return new UserJobFormView({
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

		// submit form
		//
		let model = this.getChildView('form').apply();
		if (model) {
			this.close();

			// perform callback
			//
			if (this.options.onadd) {
				this.options.onadd(model);
			}
		}
	},

	onClickCancel: function() {
		this.close();
	},
});