/******************************************************************************\
|                                                                              |
|                    invite-google-contacts-dialog-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a modal dialog box used for inviting google contacts.         |
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
import GoogleContactsInvitatationFormView from '../../../../../views/apps/profile-browser/forms/google-contacts-invitation-form-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-envelope"></i>
					</div>
					<div class="title">
						Invite Google Contacts
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>Invite your Google contacts to become a new users and connections.</p>
					<div class="google-contacts-invitation-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="buttons">
						<button class="send btn btn-primary">
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
		form: '.google-contacts-invitation-form'
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .send': 'onClickSend'
	}),

	//
	// dialog attributes
	//

	resizable: true,
	minimizable: false,

	//
	// constructor
	//

	initialize: function() {

		// call superclass method
		//
		DialogView.prototype.initialize.call(this);
	},

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
					icon: '<i class="fa fa-envelope"></i>',
					title: 'Invitation Sent',
					message: "A user invitation was sent to these contacts."
				});

				// close dialog
				//
				this.hide();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not send contact invitations.",
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
		DialogView.prototype.onRender.call(this);

		// show form
		//
		this.showChildView('form', new GoogleContactsInvitatationFormView({
			collection: this.collection,
			message: this.options.message
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSend: function() {
		this.send();
	}
});
