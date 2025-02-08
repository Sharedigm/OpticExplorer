/******************************************************************************\
|                                                                              |
|                        connection-request-dialog-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a modal dialog box used for adding connections.               |
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
import ConnectionRequestFormView from '../../../../../views/apps/connection-manager/forms/connections/connection-request-form-view.js';

export default ModalView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
		
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-user-plus"></i>
					</div>
					<div class="title">
						Send Connection Request
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<div class="connection-request-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="send btn btn-primary" data-dismiss="modal">
							<i class="fa fa-envelope"></i>Send
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
		form: '.connection-request-form'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .send': 'onClickSend'
	}),

	//
	// sending methods
	//

	send: function() {

		// submit form
		//
		this.getChildView('form').submit({

			// callbacks
			//
			success: () => {

				// play send sound
				//
				application.play('send');

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-user-friends"></i>',
					title: "Connection Requests Sent",
					message: "Connection requests were sent to the specified users.  These users will receive a connection request notification and may accept or decline your request."
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create new connection request.",
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
		this.showChildView('form', new ConnectionRequestFormView({
			model: this.model,
			collection: this.collection
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSend: function() {
		this.send();
	}
});
