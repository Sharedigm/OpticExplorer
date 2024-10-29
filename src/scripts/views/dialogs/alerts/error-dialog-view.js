/******************************************************************************\
|                                                                              |
|                             error-dialog-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a notification dialog that is used to show a             |
|        modal notifiction / alert dialog box displaying an error.             |
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

	className: 'error modal',

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-bug"></i>
					</div>
					<div class="title">
						<%= title || "Error" %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="icon"><%= icon || '<i class="fa fa-bug"></i>' %></div>
					<div class="vertically scrollable">
						<p class="message"><%= message %></p>
						<p class="response"><%= response %></p>
					</div>
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
		'click .ok': 'onClickOk'
	}),

	//
	// constructor
	//

	initialize: function() {
		this.constructor.current = this;
	},

	//
	// getting methods
	//

	getResponseText: function() {
		let response;

		if (this.options.response) {
			if (this.options.response.responseJSON && this.options.response.responseJSON.message) {
				response = this.options.response.responseJSON.message;
			} else if (this.options.response.responseText) {
				response = this.options.response.responseText;
			}
		}

		// translate errors into user readable form
		//
		if (response == 'No session.') {
			response = "You must be signed in to perform this action.";
		}

		return response;
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
			message: this.options.message,
			response: this.getResponseText()
		};
	},

	update: function(options) {
		if (this.$el) {
			if (options.icon) {
				this.$el.find('.modal-header .heading .icon').html(options.icon);
			}
			if (options.title) {
				this.$el.find('.modal-header .heading .title').html(options.title);
			}
			if (options.message) {
				this.$el.find('.message').html(options.message);
			}
			if (options.response) {
				this.$el.find('.response').html(options.response);
			}
		}
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
