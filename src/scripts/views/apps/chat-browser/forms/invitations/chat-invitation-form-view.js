/******************************************************************************\
|                                                                              |
|                         chat-invitation-form-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form to invite connections to join a chat session.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Chat from '../../../../../models/chats/chat.js';
import ChatInvitations from '../../../../../collections/chats/sharing/chat-invitations.js';
import Connections from '../../../../../collections/users/connections/connections.js';
import FormView from '../../../../../views/forms/form-view.js';
import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';

export default FormView.extend({

	//
	// attributes
	//

	className: 'form-horizontal',

	template: template(`
		<p>Select one or more connections to invite to this chat. </p>
		
		<div class="with form-group">
			<label class="required control-label"><i class="fa fa-user-friends"></i>Connections</label>
			<div class="controls">
				<div class="connections" style="display:inline-block; float:left"></div>
				<button class="select-connections btn" disabled style="margin:5px">
					<i class="fa fa-user-friends"></i>Select Connections
				</button>
			</div>
		</div>
		
		<div class="message form-group">
			<label class="control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" rows="4" maxlength="1000"></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is an optional message to the recipient(s) of the share invitation."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		connections: '.connections'
	},

	events: {
		'click .select-connections': 'onClickSelectConnections'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (!this.collection) {
			this.collection = new Connections();
		}
		this.connections = this.options.connections || [];
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'message':
				return this.$el.find('.message textarea').val();
		}
	},

	getValues: function() {
		return {
			message: this.getValue('message')
		};
	},

	getConnectionNames: function() {
		if (this.connections) {
			return this.connections.getNames();
		} else {
			return [];
		}
	},

	//
	// setting methods
	//

	setConnections: function(connections) {
		this.connections = connections;
		this.showConnections(connections);
	},

	setDisabled: function(disabled) {
		this.$el.find('.select-connections').prop('disabled', disabled !== false);
	},

	//
	// form methods
	//

	submit: function(options) {
		
		// check form validation
		//
		if (!this.isValid()) {
			return false;
		} else if (this.model) {

			// save invitations to existing chat
			//
			ChatInvitations.create(this.model, this.connections, {
				message: this.getValue('message'),
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
					ChatInvitations.create(model, this.connections, {
						message: this.getValue('message'),
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

			return true;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			options: this.options
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showConnections(this.options.connections);

		// fetch user connections
		//
		this.collection.fetchByUser(application.session.user, {

			// callbacks
			//
			success: () => this.setDisabled(false),
			error: () => this.setDisabled(true)
		});
	},

	showConnections: function(connections) {
		this.showChildView('connections', new UsersView({
			collection: new Connections(connections, {
				parse: false
			}),

			// options
			//
			preferences: UserPreferences.create('connection_manager', {
				view_kind: 'icons',
				detail_kind: null
			}),

			// capabilities
			//
			selectable: false
		}));
	},

	//
	// mouse event handling methods
	//

	onClickSelectConnections: function() {
		import(
			'../../../../../views/apps/connection-manager/dialogs/connections/select-connections-dialog-view.js'
		).then((SelectConnectionsDialogView) => {

			// show open dialog
			//
			this.parent.opener.show(new SelectConnectionsDialogView.default({
				collection: this.collection,

				// options
				//
				selected: this.connections,

				// callbacks
				//
				select: (connections) => {
					this.setConnections(connections);

					// perform callback
					//
					if (this.options.onselect) {
						this.options.onselect(connections);
					}
				}
			}));
		});
	}
});