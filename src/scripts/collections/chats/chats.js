/******************************************************************************\
|                                                                              |
|                                   chats.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of text messaging chat sessions.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Chat from '../../models/chats/chat.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Chat,
	url: config.servers.api + '/chats',

	//
	// getting methods
	//

	getChatByUser: function(user) {
		for (let i = 0; i < this.length; i++) {
			let chat = this.at(i);
			if (chat.hasUser(user)) {
				return chat;
			}
		}
	}
});