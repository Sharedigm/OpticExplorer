/******************************************************************************\
|                                                                              |
|                                 chat-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a chat session.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ChatMessage from '../../../../../models/chats/chat-message.js';
import Items from '../../../../../collections/storage/items.js';
import ChatMessages from '../../../../../collections/chats/chat-messages.js';
import BaseView from '../../../../../views/base-view.js';
import SelectableContainable from '../../../../../views/behaviors/containers/selectable-containable.js';
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import ChatMessageListView from '../../../../../views/apps/chat-viewer/mainbar/chats/lists/chat-message-list-view.js';
import ChatMessageFormView from '../../../../../views/apps/chat-viewer/forms/messages/chat-message-form-view.js';

export default BaseView.extend(_.extend({}, SelectableContainable, Timeable, {

	//
	// attributes
	//

	className: 'chat',

	template: template(`
		<div class="messages panel"></div>
		<div class="new-message panel"></div>`
	),

	regions: {
		messages: '.messages',
		form: '.new-message'
	},

	// update every 10 seconds
	//
	updateInterval: 1000 * 10,

	// redraw elapsed times every minute
	//
	redrawInterval: 1000 * 60,

	//
	// constructor
	//

	initialize: function() {
		this.collection = new ChatMessages();

		// set options
		//
		this.options.show_elapsed_time = this.options.preferences.get('show_elapsed_time');

		// listen for changes in collection
		//
		this.listenTo(this.collection, 'add', this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('messages')) {
			this.getChildView('messages').each(callback, filter, options);
		}
	},

	//
	// counting methods
	//

	numMessages: function() {
		if (this.hasChildView('messages')) {
			return this.getChildView('messages').children.length;
		}
	},

	//
	// getting methods
	//

	getScrollHeight: function() {
		if (this.hasChildView('messages')) {
			return this.getChildView('messages').el.scrollHeight;
		} else {
			return 0;
		}
	},

	//
	// ajax methods
	//

	fetchMessages: function(done) {

		// fetch chat messages
		//
		this.request = this.collection.fetchByChat(this.model, {

			// fetch parameters
			//
			data: _.extend({}, this.options.search, {
				to: this.options.preferences.get('messages_per_page'),
				language: this.options.preferences.get('translation')? this.options.preferences.get('language') : undefined
			}),

			// callbacks
			//
			success: (collection) => {
				this.request = null;

				// perform callback
				//
				if (done) {
					done(collection);
				}
			}
		});
	},

	fetchMessageUpdates: function(done) {

		// fetch chat messages since last request
		//
		this.request = new ChatMessages().fetchReceivedByChat(this.model, {
			data: {
				after: this.lastDate? this.lastDate.format('yyyy-mm-dd HH:MM:ss', false) : undefined,
				language: this.options.preferences.get('translation')? this.options.preferences.get('language') : undefined		
			},

			// callbacks
			//
			success: (collection) => {

				// perform callback
				//
				if (done) {
					done(collection);
				}
			}
		});
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'messages_per_page':
				this.options.messages_per_page = value;

				// update message list
				//
				this.fetchAndShowMessages();
				break;

			case 'show_elapsed_time':
				this.options.show_elapsed_time = value;

				// update view
				//
				this.showMessages();
				break;
		}
	},

	setModel: function(model) {
		this.setChat(model);
	},

	setChat: function(chat) {

		// clear previous chat
		//
		this.resetChat();

		// set attributes
		//
		this.model = chat;
		this.getChildView('form').setChat(chat);

		// clear elapsed times interval
		//
		this.clearInterval();

		// clear update timeout
		//
		this.clearTimeout();

		// fetch and show messages for new chat
		//
		this.fetchAndShowMessages();
	},

	setMessagesPerPage: function(messagesPerPage) {
		if (messagesPerPage != this.getMessagesPerPage()) {
			this.getChildView('nav_bar').setItemsPerPage(messagesPerPage);
			
			// update messages list
			//
			this.fetchAndShowMessages();
		}
	},

	resetChat: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}

		// clear elapsed times interval
		//
		this.clearInterval();

		// clear update timeout
		//
		this.clearTimeout();

		// clean up soft deleted messages
		//
		this.collection.updateByChat(this.model);
	},
	
	//
	// sharing methods
	//

	shareItems: function(options) {
		this.getChildView('form').showOpenFilesDialog(options);
	},

	shareLocation: function(options) {
		this.getChildView('form').checkIn(options);
	},

	//
	// list editing methods
	//

	addMessage: function(model) {

		// add new item to end of list
		//
		this.collection.add(model);

		// adjust scrolling
		//
		this.scrollToBottom();

		// update last date
		//
		this.updateDate(model);
	},

	updateMessage: function(model) {

		// update item
		//
		let item = this.collection.get(model.get('id'));
		if (item) {
			item.set(model.attributes);
		}

		// update last date
		//
		this.updateDate(model);
	},

	deleteMessage: function(model) {

		// delete item
		//
		let item = this.collection.get(model.get('id'));
		if (item) {
			this.collection.remove(item);
		}

		// update last date
		//
		if (!this.lastDate || model.get('deleted_at').getTime() > this.lastDate.getTime()) {
			this.lastDate = model.get('deleted_at');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		
		// show child views
		//
		this.showMessageForm();
		this.fetchAndShowMessages();
	},

	fetchAndShowMessages: function() {
		this.fetchMessages((collection) => {

			// check if view still exists
			//
			if (this.isDestroyed()) {
				return;
			}

			// show views
			//
			this.showMessages();
			this.scrollToBottom();

			// update elapsed times
			//
			if (this.options.show_elapsed_time) {
				this.setInterval(() => {
					this.getChildView('messages').update();
				}, this.redrawInterval);
			}

			// save date of most recent change
			//
			if (collection.length > 0) {
				this.lastDate = collection.getUpdateDate();
			}

			// schedule next update
			//
			this.setTimeout(() => {
				this.updateMessages();
			}, this.updateInterval);

			// perform callback
			//
			if (this.options.onload) {
				this.options.onload(this.model);
			}
		});	
	},

	showMessages: function() {
		this.showChildView('messages', new ChatMessageListView(_.extend({}, this.options, {
			collection: this.collection,

			// callbacks
			//
			onchange: () => this.scrollToBottom(),
		})));
	},

	showMessageForm: function() {
		this.showChildView('form', new ChatMessageFormView({
			model: new ChatMessage({
				chat_id: this.model.get('id'),
				message: this.options.message,
				attachments: new Items(this.options.items),
				check_in: this.options.check_in,
				placement: 'top'
			}),

			// options
			//
			preferences: this.options.preferences,
			position: 'bottom',

			// capabilities
			//
			submitable: true,
			cancelable: false,

			// callbacks
			//
			onsubmit: (message) => {

				// add message to list
				//
				this.addMessage(message);

				// play add sound
				//
				application.play('add');
			}
		}));
	},

	scrollToBottom: function() {
		this.$el.find('.messages')[0].scrollTop = this.getScrollHeight();
	},

	//
	// updating methods
	//

	updateMessages: function() {
		this.fetchMessageUpdates((collection) => {

			// check for new messages
			//
			if (collection.length > 0) {

				// update collection
				//
				for (let i = 0; i < collection.length; i++) {
					let model = collection.at(i);

					if (model.hasDeleteDate()) {
						this.deleteMessage(model);
					} else if (model.isUpdated()) {
						this.updateMessage(model);
					} else {
						this.addMessage(model);
					}
				}

				// adjust scrolling
				//
				this.scrollToBottom();

				// play add sound
				//
				application.play('add');
			}

			// schedule next update
			//
			this.setTimeout(() => {
				this.updateMessages();
			}, this.updateInterval);
		});
	},
	
	updateDate: function(model) {

		// update last date
		//
		if (!this.lastDate || model.get('created_at').getTime() > this.lastDate.getTime()) {
			this.lastDate = model.get('created_at');
		}
	},

	//
	// event handling methods
	//

	onAdd: function(model) {

		// perform callback
		//
		if (this.options.onadd) {
			this.options.onadd(model);
		}
	},

	onRemove: function(model) {

		// perform callback
		//
		if (this.options.onremove) {
			this.options.onremove(model);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.resetChat();
	}
}));