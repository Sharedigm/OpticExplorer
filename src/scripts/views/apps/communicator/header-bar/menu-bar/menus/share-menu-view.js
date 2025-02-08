/******************************************************************************\
|                                                                              |
|                               share-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying share dropdown menus.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topic from '../../../../../../models/topics/topic.js';
import Post from '../../../../../../models/topics/post.js';
import Comment from '../../../../../../models/comments/comment.js';
import Reply from '../../../../../../models/comments/reply.js';
import Chat from '../../../../../../models/chats/chat.js';
import ChatMessage from '../../../../../../models/chats/chat-message.js';
import ShareMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/share-menu-view.js';

export default ShareMenuView.extend({

	//
	// attributes
	//

	events: {

		// share with everyone
		//
		'click .share-by-topic': 'onClickShareByTopic',

		// share chat with connections
		//
		'click .share-chat': 'onClickShareChat',

		// share topic with connections
		//
		'click .share-topic': 'onClickShareTopic',
		'click .like': 'onClickLike',
		'click .reply-to': 'onClickReplyTo',
		'click .share-by-message': 'onClickShareByMessage',

		// share with anyone
		//
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail',

		// share items
		//
		'click .share-attachments': 'onClickShareAttachments',
		'click .share-location': 'onClickShareLocation'
	},

	//
	// querying methods
	//

	visible: function() {
		let isTopic = this.parent.app.model instanceof Topic;
		let isChat = this.parent.app.model instanceof Chat;

		return {
			'share-topic': isTopic,
			'share-chat': isChat
		};
	},
	
	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let isRequired = this.parent.app.model instanceof Topic && this.parent.app.model.isRequired();

		return {
			'share-topic': isSignedIn && !isRequired
		};
	},

	//
	// getting methods
	//

	getItems: function() {
		let items = ShareMenuView.prototype.getItems.call(this);
		return items.concat(this.getFileItems());
	},

	getMenuMode: function(item) {
		if (item instanceof Topic) {
			return 'topic';
		} else if (item instanceof Post) {
			return 'post';
		} else if (item instanceof Comment) {
			return 'comment';
		} else if (item instanceof Reply) {
			return 'reply';
		} else if (item instanceof Chat) {
			return 'chat';
		} else if (item instanceof ChatMessage) {
			return 'chat';
		}
	},

	//
	// setting methods
	//

	setTopic: function(topic) {
		this.setDisabled({
			'share-topic': topic.isRequired(),
		});
	},

	setMenuMode: function(mode) {
		this.$el.find('.topic-option').hide();
		this.$el.find('.post-option').hide();
		this.$el.find('.comment-option').hide();
		this.$el.find('.reply-option').hide();
		this.$el.find('.chat-option').hide();

		switch (mode) {
			case 'topic':
				this.$el.find('.topic-option').show();
				break;
			case 'post':
				this.$el.find('.post-option').show();
				break;
			case 'comment':
				this.$el.find('.comment-option').show();
				break;
			case 'reply':
				this.$el.find('.reply-option').show();
				break;
			case 'chat':
				this.$el.find('.chat-option').show();
				break;
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// hide items not pertaining to topic
		//
		this.$el.find('.post-option').hide();
		this.$el.find('.comment-option').hide();
		this.$el.find('.reply-option').hide();
	},

	update: function() {

		// call superclass method
		//
		ShareMenuView.prototype.update.call(this);

		// set menu mode
		//
		let item = this.parent.app.selected? this.parent.app.selected.model : this.parent.app.model;
		this.setMenuMode(this.getMenuMode(item));

		// set enabled / disabled state
		//
		if (item && item.isLikeableByCurrentUser) {
			if (item.isLikeableByCurrentUser()) {
				this.$el.find('li.like').removeClass('disabled');
			} else {
				this.$el.find('li.like').addClass('disabled');
			}
		}	
	},

	//
	// event handling methods
	//

	onChange: function() {
		this.update();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	},
	
	//
	// mouse event handling methods
	//

	onClickShareTopic: function() {
		if (this.parent.app.model) {
			this.parent.app.showTopicInvitationsDialog(this.parent.app.model);
		}
	},

	onClickShareChat: function() {
		if (this.parent.app.model) {
			this.parent.app.showChatInvitationsDialog(this.parent.app.model);
		}
	},

	onClickLike: function() {
		if (this.parent.app.selected) {
			this.parent.app.selected.like();
		}
	},

	onClickReplyTo: function() {
		if (this.parent.app.selected) {
			this.parent.app.selected.reply();
		}
	},

	onClickShareByMessage: function() {
		this.parent.app.shareSelectedByMessage();
	},

	onClickShareByLink: function() {
		this.parent.app.shareSelectedByLink();
	},

	onClickShareByEmail: function() {
		this.parent.app.shareSelectedByEmail();
	},

	onClickShareByTopic: function() {
		this.parent.app.shareSelectedByTopic();
	},

	onClickShareAttachments: function(event) {
		let key = $(event.target).closest('a').text().trim();
		let files = config.defaults.sharing.files[key];
		let directory = application.getDirectory(files.directory);
		this.parent.app.shareItems(directory);
	},

	onClickShareLocation: function() {
		this.parent.app.shareLocation();
	}
});