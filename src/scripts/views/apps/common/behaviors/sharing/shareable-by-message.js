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
	// sharing methods
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
				application.showChat(chats[0], {
					items: [item],
					message: config.apps.file_browser.share_invitation_message
				});
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
				application.showChat(chats[0], {
					items: items,
					message: config.apps.file_browser.share_invitation_message
				});
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
		import(
			'../../../../../views/apps/chat-viewer/dialogs/chats/open-chats-dialog-view.js'
		).then((OpenChatsDialogView) => {

			// show open dialog
			//
			this.show(new OpenChatsDialogView.default({

				// options
				//
				title: "Open Chats",

				// callbacks
				//
				onopen: (items) => {
					if (options && options.onopen) {
						options.onopen(items);
					}
				}
			}));
		});
	}
};