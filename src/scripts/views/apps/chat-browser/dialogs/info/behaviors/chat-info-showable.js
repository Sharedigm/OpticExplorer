/******************************************************************************\
|                                                                              |
|                              chat-info-showable.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing chat information.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Chats from '../../../../../../collections/chats/chats.js';

export default {

	//
	// dialog rendering methods
	//

	showChatInfoDialog: function(chat, options) {
		import(
			'../../../../../../views/apps/chat-browser/dialogs/info/chat-info-dialog-view.js'
		).then((ChatInfoDialogView) => {

			// show chat info dialog
			//
			this.show(new ChatInfoDialogView.default(_.extend({
				model: chat
			}, options)));				
		});		
	},

	showChatsInfoDialog: function(chats, options) {

		// show info for a single item
		//
		if (chats.length == 1) {
			this.showChatInfoDialog(chats[0], options);
			return;
		}

		// show info for multiple items
		//
		import(
			'../../../../../../views/apps/chat-browser/dialogs/info/chats-info-dialog-view.js'
		).then((ChatsInfoDialogView) => {

			// show chats info dialog
			//
			this.show(new ChatsInfoDialogView.default(_.extend({
				collection: new Chats(chats)
			}, options)));				
		});
	}
};