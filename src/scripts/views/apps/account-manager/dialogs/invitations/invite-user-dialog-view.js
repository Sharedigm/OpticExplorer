/******************************************************************************\
|                                                                              |
|                          invite-user-dialog-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a modal dialog box used for inviting new users.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserInvitation from '../../../../../models/users/account/user-invitation.js';
import ModalView from '../../../../../views/dialogs/modal-view.js';
import UserInvitatationFormView from '../../../../../views/apps/account-manager/forms/user-invitation-form-view.js';

export default ModalView.extend({

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
						Invite New User
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="modal-body">
					<p>Invite someone who doesn't have an account to become a new user and connection.</p>
					<div class="user-invitation-form"></div>
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
		form: '.user-invitation-form'
	},

	events: _.extend({}, ModalView.prototype.events, {
		'click .send': 'onClickSend'
	}),

	//
	// constructor
	//

	initialize: function() {

		// call superclass method
		//
		ModalView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = new UserInvitation({
			inviter_id: application.session.user.get('id')
		});
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
					message: "A user invitation was sent to this email address."
				});

				// close dialog
				//
				this.hide();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not create user invitation.",
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

		// show form
		//
		this.showChildView('form', new UserInvitatationFormView({
			model: this.model
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSend: function() {
		this.send();
	}
});
