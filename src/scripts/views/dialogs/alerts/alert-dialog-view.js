/******************************************************************************\
|                                                                              |
|                              alert-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification dialog that is used to show a             |
|        modal alert dialog box.                                               |
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

	className: 'alert modal',

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<%= icon || '<i class="fa fa-exclamation-triangle"></i>' %>
					</div>
					<div class="title">
						<%= title || "Alert" %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="icon"><%= icon || '<i class="fa fa-exclamation-triangle"></i>' %></div>
					<p><%= message %></p>
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
		'click': 'onClick',
		'click .ok': 'onClickOk'
	}),

	//
	// constructor
	//

	initialize: function() {
		this.constructor.current = this;
	},
	
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

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.constructor.current = null;

		// call superclass method
		//
		ModalView.prototype.onBeforeDestroy.call(this);
	}
});
