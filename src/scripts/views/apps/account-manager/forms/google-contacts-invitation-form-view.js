/******************************************************************************\
|                                                                              |
|                    google-contacts-invitation-form-view.js                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inviting selected google contacts.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserInvitation from '../../../../models/users/account/user-invitation.js';
import FormView from '../../../../views/forms/form-view.js';
import ContactsListView from '../../../../views/apps/contact-editor/mainbar/contacts/lists/contacts-list-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<div class="message form-group">
			<label class="control-label"><i class="fa fa-id-card"></i>Contacts</label>
			<div class="controls">
				<div class="items"></div>
			</div>
		</div>
		
		<br />
		
		<div class="message form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" name="message" rows="4" maxlength="1000"><%= message %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is the email message to send."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		items: '.items'
	},

	//
	// form querying methods
	//

	getValue: function(key) {
		switch (key) {
			case 'message':
				return this.$el.find('.message textarea').val();
			case 'contacts':
				return this.getChildView('items').getCheckedModels();
		}
	},

	//
	// form methods
	//

	submit: function(options) {
		let contacts = this.getValue('contacts');
		let message = this.getValue('message');
		let count = 0;

		function sendInvitation(contact) {
			new UserInvitation({
				inviter_id: application.session.user.get('id'),
			}).save({
				invitee_name: contact.getName(),
				invitee_email: contact.getEmail(),
				message: message
			}, {

				// callbacks
				//
				success: (model) => {
					count++;
					if (count == contacts.length) {

						// perform callback
						//
						if (options && options.success) {
							options.success(model);
						}
					}
				}
			});
		}

		// send invitations
		//
		for (let i = 0; i < contacts.length; i++) {
			sendInvitation(contacts[i]);
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			message: this.options.message
		};
	},

	onRender: function() {

		// show child views
		//
		this.showContactsList();
	},

	showContactsList: function() {
		this.showChildView('items', new ContactsListView({
			collection: this.collection,

			// options
			//
			checked: true,

			// capabilities
			//
			selectable: false
		}));
	}
});