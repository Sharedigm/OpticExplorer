/******************************************************************************\
|                                                                              |
|                      user-validation-error-dialog-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an error dialog that is shown if a user tries to         |
|        to register a new user with invalid fields.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ModalView from '../../../../views/dialogs/modal-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-user"></i>
					</div>
					<div class="title">
						User Validation Error
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>This user profile is not valid for the following reasons: </p>
					<ul>
					<% for (let i = 0; i < errors.length; i++) { %>
						<li><%= errors[i].replace('"', "&quot") %></li>
					<% } %>
					</ul>
					<p>Please correct the form and resubmit. </p>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="ok btn btn-primary" data-dismiss="modal">
							<i class="fa fa-check"></i>OK
						</button>
					</div>
				</div>
			</div>
		</div>
	`),

	events: _.extend({}, ModalView.prototype.events, {
		'submit': 'onSubmit'
	}),

	//
	// dialog methods
	//

	accept: function() {

		// perform callback
		//
		if (this.options.accept) {
			this.options.accept();
		}

		// close dialog
		//
		this.hide();
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.options.title,
			errors: this.options.errors
		};
	},

	//
	// event handling methods
	//

	onSubmit: function() {
		this.accept();

		// disable default form submission
		//
		return false;
	}
});
