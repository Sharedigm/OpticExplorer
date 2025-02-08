/******************************************************************************\
|                                                                              |
|                           shareable-by-message.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior that allows sharing by chat message.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// rendering methods
	//

	showItemByMessage: function(item, chat) {
		application.launch('chat_viewer', {
			model: chat,
			items: [item],
			message: config.apps.file_browser.share_invitation_message
		});
	},

	showItemsByMessage: function(items, chat) {
		application.launch('chat_viewer', {
			model: chat,
			items: items,
			message: config.apps.file_browser.share_invitation_message
		});
	},

	//
	// selection / sharing methods
	//

	shareItemByMessage: function(item) {

		// select chats
		//
		this.showOpenChatsDialog({

			// callbacks
			//
			onopen: (chats) => {

				// show selected chat
				//
				this.showItemByMessage(item, chats[0]);
			}
		});
	},

	shareItemsByMessage: function(items) {

		// select chats
		//
		this.showOpenChatsDialog({

			// callbacks
			//
			onopen: (chats) => {

				// show selected chat
				//
				this.showItemsByMessage(items, chats[0]);
			}
		});
	},

	shareSelectedByMessage: function(options) {
		this.shareItemsByMessage(this.getSelectedModels(), _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareModelByMessage: function(options) {
		this.shareItemByMessage(this.getModel? this.getModel() : this.model, _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareByMessage: function(options) {
		if (this.hasSelected()) {
			this.shareSelectedByMessage(options);
		} else {
			this.shareModelByMessage(options);
		}
	},

	//
	// dialog rendering methods
	//

	showOpenChatsDialog: function(options) {
		application.loadAppView('chat_viewer', {
			success: (ChatViewer) => {
				ChatViewer.showOpenChatsDialog({

					// callbacks
					//
					onopen: (items) => {
						if (options && options.onopen) {
							options.onopen(items);
						}
					}
				});
			}
		});
	}
};