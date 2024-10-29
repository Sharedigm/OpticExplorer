/******************************************************************************\
|                                                                              |
|                               chat-messages.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of text messaging chat messages.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ChatMessage from '../../models/chats/chat-message.js';
import TimestampedCollection from '../../collections/utilities/timestamped-collection.js';

export default TimestampedCollection.extend({

	//
	// attributes
	//

	model: ChatMessage,

	//
	// fetching methods
	//

	fetchByChat: function(chat, options) {
		return this.fetch(_.extend(options, {
			url: chat.url() + '/messages',
			silent: true
		}));
	},

	fetchSentByChatSender: function(chat, options) {
		return this.fetch(_.extend(options, {
			url: chat.url() + '/messages/sent',
			silent: true
		}));
	},

	fetchReceivedByChat: function(chat, options) {
		return this.fetch(_.extend(options, {
			url: chat.url() + '/messages/received',
			silent: true
		}));
	},

	//
	// updating method - called to clean up soft deleted items
	//

	updateByChat: function(chat, options) {
		return $.ajax(_.extend({
			url: chat.url() + '/messages/update',
			type: 'PUT'
		}, options));
	}
});
