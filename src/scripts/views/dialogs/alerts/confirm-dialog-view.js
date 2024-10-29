/******************************************************************************\
|                                                                              |
|                            confirm-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification modal dialog box that is used to          |
|        prompt the user for confirmation to proceed with some action.         |
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

	className: 'confirm modal',

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<%= icon || '<i class="fa fa-question-circle"></i>' %>
					</div>
					<div class="title">
						<%= title || "Confirm" %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="icon"><%= icon || '<i class="fa fa-question-circle"></i>' %></div>
					<p><%= message %></p>
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

	events: _.extend({}, ModalView.prototype.events, {
		'click .ok': 'onClickOk',
		'click .cancel': 'onClickCancel'
	}),

	//
	// dialog methods
	//

	accept: function() {

		// perform callback
		//
		if (this.options.accept) {
			return this.options.accept();
		}
	},

	reject: function() {

		// perform callback
		//
		if (this.options.reject) {
			return this.options.reject();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			icon: this.options.icon,
			title: this.options.title,
			message: this.options.message
		};
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.accept();
	},

	onClickCancel: function() {
		this.reject();
	}
});
