/******************************************************************************\
|                                                                              |
|                               chat-showable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying chats.                         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Chats from '../collections/chats/chats.js';

export default {

	//
	// getting methods
	//

	getChatViewer: function() {

		// use either chat viewer app
		//
		if (!config.apps.topic_viewer.hidden) {
			return 'chat_viewer';

		// use message viewer app
		//
		} else if (!config.apps.communicator.hidden) {
			return 'communicator';
		}
	},

	//
	// chat showing methods
	//

	showChat: function(chat, options) {
		let appName = this.getChatViewer();

		if (this.desktop) {
			if (this.desktop.hasApp(appName)) {

				// open in desktop
				//
				this.desktop.setApp(appName, () => {
					this.desktop.getAppView(appName).openChat(chat, options);
				});
			} else {

				// open in new window
				//
				this.launch(appName, _.extend({}, options, {
					model: chat
				}));
			}
		} else {

			// open in new page
			//
			application.showUrl(chat.getUrl());
		}
	},

	showChats: function(chats, options) {
		let appName = this.getChatViewer();

		if (this.desktop) {
			if (this.desktop.hasApp(appName)) {

				// open in desktop
				//
				this.desktop.setApp(appName, () => {
					this.desktop.getAppView(appName).openChats(chats, options);
				});
			} else {

				// open in new window
				//
				this.launch(appName, _.extend({}, options, {
					collection: new Chats(chats)
				}));
			}
		}
	}
};