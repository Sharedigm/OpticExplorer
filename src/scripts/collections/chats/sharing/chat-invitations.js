/******************************************************************************\
|                                                                              |
|                              chat-invitations.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of text messaging chat session         |
|        invitations.                                                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ChatInvitation from '../../../models/chats/sharing/chat-invitation.js';
import ShareRequest from '../../../models/storage/sharing/share-request.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: ChatInvitation,

	//
	// fetching methods
	//

	fetchByChat: function(chat, options) {

		// fetch chat invitations for a particular chat
		//
		return this.fetch(_.extend(options, {
			url: chat.url() + '/invitations'
		}));
	},

	fetchByItem: function(item, options) {

		// fetch share requests for a particular item
		//
		return this.fetch(_.extend(options, {
			url: ShareRequest.prototype.urlRoot + '?' + item.getQueryString()
		}));
	},

	fetchSent: function(options) {

		// fetch all share requests sent by current user
		//
		return this.fetch(_.extend(options, {
			url: ShareRequest.prototype.urlRoot + '/sent'
		}));
	},

	fetchSentPending: function(options) {

		// fetch pending share requests sent by current user
		//
		return this.fetch(_.extend(options, {
			url: ShareRequest.prototype.urlRoot + '/sent/pending'
		}));
	},

	fetchSentTo: function(user, options) {

		// fetch share requests sent by current user to a particular user
		//
		return this.fetch(_.extend(options, {
			url: ShareRequest.prototype.urlRoot + '/sent/users/' + user.get('id')
		}));
	},

	fetchPendingSentTo: function(user, options) {

		// fetch pending share requests sent by current user to a particular user
		//
		return this.fetch(_.extend(options, {
			url: ShareRequest.prototype.urlRoot + '/sent/pending/users/' + user.get('id')
		}));
	},

	fetchReceived: function(options) {

		// fetch all share requests received by current user
		//
		return this.fetch(_.extend(options, {
			url: ShareRequest.prototype.urlRoot + '/received'
		}));
	},

	fetchReceivedPending: function(options) {

		// fetch pending share requests received by current user
		//
		return this.fetch(_.extend(options, {
			url: ShareRequest.prototype.urlRoot + '/received/pending'
		}));
	},

	fetchReceivedFrom: function(user, options) {

		// fetch share requests sent by a particular user received by current user
		//
		return this.fetch(_.extend(options, {
			url: user.url() + '/share-requests/received'
		}));
	},

	fetchPendingReceivedFrom: function(user, options) {

		// fetch pending share requests sent by a particular user received by current user
		//
		return this.fetch(_.extend(options, {
			url: user.url() + '/share-requests/received/pending'
		}));
	}
}, {
	//
	// static methods
	//

	create: function(chat, recipients, options) {
		let collection = new this();

		// create collection of chat invitations
		//
		for (let i = 0; i < recipients.length; i++) {
			let recipient = recipients[i];
			collection.add(new ChatInvitation({
				chat_id: chat.get('id'),
				recipient_id: recipient.get('id'),
				message: options? options.message : null
			}));
		}

		return collection;
	}
});
