/******************************************************************************\
|                                                                              |
|                        chat-invitations-dialog-view.js                       |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a dialog box to invite connections to a chat.            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Chat from '../../../../../models/chats/chat.js';
import ChatInvitations from '../../../../../collections/chats/sharing/chat-invitations.js';
import DialogView from '../../../../../views/dialogs/dialog-view.js';
import ChatInvitationMessageFormView from '../../../../../views/apps/chat-browser/forms/invitations/chat-invitation-message-form-view.js';

export default DialogView.extend({

	//
	// attributes
	//
	
	className: 'focused modal dialog',

	template: template(`
		<div class="modal-dialog">
			
			<div class="modal-header">
				<div class="heading">
					<div class="icon">
						<i class="fa fa-envelope"></i>
					</div>
					<div class="title">
						<% if (chat) { %>
						Send Invitations to Chat with <%= chat.getName() %>
						<% } else { %>
						Send New Chat Invitations
						<% } %>
					</div>
				</div>
			</div>
		
			<div class="modal-content">
				<div class="connection-manager"></div>
				<div class="panel">
					<div class="message-form"></div>
				</div>
		
				<div class="modal-footer">
					<div class="notes">
						<span class="required"></span>Fields are required
					</div>
					
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
		connection_manager: {
			el: '.connection-manager',
			replaceElement: true
		},
		form: {
			el: '.message-form',
			replaceElement: true
		}
	},

	events: _.extend({}, DialogView.prototype.events, {
		'click .send': 'onClickSend'
	}),

	//
	// querying methods
	//

	isValid: function() {
		return this.hasSelected() && this.getChildView('form').isValid();
	},

	hasSelected: function() {
		return this.getChildView('connection_manager').hasSelected();
	},

	//
	// getting methods
	//

	getSelectedModels: function() {
		return this.getChildView('connection_manager').getSelectedModels();
	},

	getModelNames: function(models) {
		let names = [];
		if (models) {
			for (let i = 0; i < models.length; i++) {
				names.push(models[i].getName());
			}
		}
		return names;
	},

	getMessage: function() {
		return this.getChildView('form').getValue('message');
	},

	//
	// setting methods
	//

	setDisabled: function(disabled) {
		this.$el.find('.send').prop('disabled', disabled !== false);
	},

	//
	// invitation sending method
	//

	sendChatInvitationsTo: function(users, options) {
		if (this.model) {

			// save invitations to existing chat
			//
			ChatInvitations.create(this.model, users, {
				message: this.getMessage(),
			}).save(options);			
		} else {

			// create new chat
			//
			new Chat().save(undefined, {

				// callbacks
				//
				success: (model) => {

					// save invitations
					//
					ChatInvitations.create(model, users, {
						message: this.getMessage(),
					}).save(options);
				},

				error: () => {

					// show error message
					//
					application.error({
						message: "Could not create new chat."
					});
				}
			});
		}
	},

	send: function() {
		let users = this.getSelectedModels();
		
		// submit form
		//
		this.sendChatInvitationsTo(users, {
			
			// callbacks
			//
			success: () => {
				let names = this.getModelNames(users);

				// play send sound
				//
				application.play('send');
				
				// close dialog
				//
				this.hide();

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: 'Chat Invitations Sent',
					message: names.toList() + ' ' + (names.length == 1? 'has' : 'have') + ' been sent ' +
						(names.length == 1? 'an invitation' : 'invitations') + ' to join your chat.'
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not send chat invitations.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			chat: this.model
		};
	},

	onRender: function() {
		
		// call superclass method
		//
		DialogView.prototype.onRender.call(this);

		// show child views
		//
		this.showConnectionManager();
		this.showMessageForm();

		// set initial state
		//
		this.setDisabled(true);
	},

	showConnectionManager: function() {
		this.showChildApp('connection_manager', {

			// callbacks
			//
			onselect: () => this.onChange(),
			ondeselect: () => this.onChange()
		});
	},

	showMessageForm: function() {
		this.showChildView('form', new ChatInvitationMessageFormView({
			model: this.model,

			// options
			//
			message: this.options.message,

			// callbacks
			//
			onvalidate: () => this.onChange()
		}));
	},
	
	//
	// event handling methods
	//

	onChange: function() {
		this.setDisabled(!this.isValid());
	},

	//
	// mouse event handling methods
	//

	onClickSend: function() {

		// send invitations
		//
		this.send({

			// callbacks
			//
			success: () => {

				// close dialog 
				//
				this.hide();
			}
		});
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('connection_manager').onKeyDown(event);
	}
});