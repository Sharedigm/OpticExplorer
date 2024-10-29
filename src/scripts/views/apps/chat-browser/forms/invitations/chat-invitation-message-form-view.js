/******************************************************************************\
|                                                                              |
|                     chat-invitation-message-form-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a form for inputing a chat invitation message.                |
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
import Chats from '../../../../../collections/chats/chats.js';
import FormView from '../../../../../views/forms/form-view.js';
import ChatsView from '../../../../../views/apps/chat-browser/mainbar/chats/chats-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: template(`
		<% if (show_chat) { %>
		<div class="shared-chat form-group hidden-xs">
			<label class="control-label"><i class="fa fa-comment"></i>Chat with</label>
			<div class="controls">
				<div class="chat"></div>
			</div>
		</div>
		<% } %>
		
		<div class="message form-group">
			<label class="required control-label"><i class="fa fa-quote-left"></i>Message</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="required form-control" rows="1"><%= message %></textarea>
		
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" title="Message" data-content="This is the message to send with your chat invitation."></i>
					</div>
				</div>
			</div>
		</div>
	`),

	regions: {
		chat: {
			el: '.chat',
			replaceElement: true
		}
	},

	//
	// form querying methods
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

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			message: this.options.message,
			show_chat: this.model != null
		};
	},

	onRender: function() {

		// call superclass method
		//
		FormView.prototype.onRender.call(this);

		// show child views
		//
		if (this.model) {
			this.showChat();
		}
	},

	showChat: function() {
		this.showChildView('chat', new ChatsView({
			collection: new Chats([this.model]),

			// options
			//
			preferences: UserPreferences.create('chat_viewer', {
				view_kind: 'names',
				detail_kind: null
			}),

			// capabilities
			//
			selectable: false
		}));
	}
});
