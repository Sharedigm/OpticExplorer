/******************************************************************************\
|                                                                              |
|                               edit-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying edit dropdown menus.                    |
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
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" class="topic-option">
			<a class="edit-topic"><i class="fa fa-pencil-alt"></i>Edit Topic<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="topic-option">
			<a class="delete-topic"><i class="fa fa-trash-alt"></i>Delete Topic<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="post-option">
			<a class="edit-post"><i class="fa fa-pencil-alt"></i>Edit Post<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="post-option">
			<a class="delete-post"><i class="fa fa-trash-alt"></i>Delete Post<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="comment-option">
			<a class="edit-comment"><i class="fa fa-pencil-alt"></i>Edit Comment<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="comment-option">
			<a class="delete-comment"><i class="fa fa-trash-alt"></i>Delete Comment<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="reply-option">
			<a class="edit-reply"><i class="fa fa-pencil-alt"></i>Edit Reply<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="reply-option">
			<a class="delete-reply"><i class="fa fa-trash-alt"></i>Delete Reply<span class="shortcut">delete</span></a>
		</li>
		
		<li role="presentation" class="message-option">
			<a class="edit-message"><i class="fa fa-pencil-alt"></i>Edit Message<span class="command shortcut">E</span></a>
		</li>
		
		<li role="presentation" class="message-option">
			<a class="delete-message"><i class="fa fa-trash-alt"></i>Delete Message<span class="shortcut">delete</span></a>
		</li>
	`),

	events: {

		// topic options
		//
		'click .edit-topic': 'onClickEdit',
		'click .edit-post': 'onClickEdit',
		'click .edit-comment': 'onClickEdit',
		'click .edit-reply': 'onClickEdit',
		'click .edit-message': 'onClickEdit',

		'click .delete-topic': 'onClickDelete',
		'click .delete-post': 'onClickDelete',
		'click .delete-comment': 'onClickDelete',
		'click .delete-reply': 'onClickDelete',
		'click .delete-message': 'onClickDelete',
	},

	//
	// querying methods
	//

	visible: function() {
		let selectedItem = this.parent.app.selected? this.parent.app.selected.model : this.parent.app.model;
		
		let isTopicSelected = selectedItem instanceof Topic;
		let isPostSelected = selectedItem instanceof Post;
		let isCommentSelected = selectedItem instanceof Comment;
		let isReplySelected = selectedItem instanceof Reply;
		let isMessageSelected = selectedItem instanceof ChatMessage;
		let isNoneSelected = !isTopicSelected && !isPostSelected && !isCommentSelected && !isReplySelected && !isMessageSelected;

		return {
			'edit-topic': isTopicSelected || isNoneSelected,
			'delete-topic': isTopicSelected || isNoneSelected,
			'edit-post': isPostSelected,
			'delete-post': isPostSelected,
			'edit-comment': isCommentSelected,
			'delete-comment': isCommentSelected,
			'edit-reply': isReplySelected,
			'delete-reply': isReplySelected,
			'edit-message': isMessageSelected,
			'delete-message': isMessageSelected,
		};
	},

	enabled: function() {
		let selectedItem = this.parent.app.selected? this.parent.app.selected.model : this.parent.app.model;
		
		let isTopicSelected = selectedItem instanceof Topic;
		let isPostSelected = selectedItem instanceof Post;
		let isCommentSelected = selectedItem instanceof Comment;
		let isReplySelected = selectedItem instanceof Reply;
		let isMessageSelected = selectedItem instanceof ChatMessage;

		let isItemEditable = selectedItem && selectedItem.isOwnedBy && selectedItem.isOwnedBy(application.session.user);
		let isTopicEditable = isTopicSelected && isItemEditable;
		let isPostEditable = isPostSelected && isItemEditable;
		let isCommentEditable = isCommentSelected && isItemEditable;
		let isReplyEditable = isReplySelected && isItemEditable;
		let isMessageEditable = isMessageSelected && isItemEditable;

		return {
			'edit-topic': isTopicEditable,
			'delete-topic': isTopicEditable,
			'edit-post': isPostEditable,
			'delete-post': isPostEditable,
			'edit-comment': isCommentEditable,
			'delete-comment': isCommentEditable,
			'edit-reply': isReplyEditable,
			'delete-reply': isReplyEditable,
			'edit-message': isMessageEditable,
			'delete-message': isMessageEditable,
		};
	},

	//
	// getting methods
	//

	getMenuMode: function(model) {
		if (model instanceof Topic) {
			return 'topic';
		} else if (model instanceof Post) {
			return 'post';
		} else if (model instanceof Comment) {
			return 'comment';
		} else if (model instanceof Reply) {
			return 'reply';
		} else if (model instanceof Chat || model instanceof ChatMessage) {
			return 'message';
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		MenuView.prototype.onRender.call(this);

		// set initial menu mode
		//
		this.setMenuMode('topic');
	},

	//
	// setting methods
	//

	setMenuMode: function(mode) {
		this.setElementVisible('.topic-option', mode == 'topic');
		this.setElementVisible('.post-option', mode == 'post');
		this.setElementVisible('.comment-option', mode == 'comment');
		this.setElementVisible('.reply-option', mode == 'reply');
		this.setElementVisible('.chat-option', mode == 'chat');
		this.setElementVisible('.message-option', mode == 'message');
	},

	//
	// mouse event handling methods
	//

	onClickEdit: function() {
		this.parent.app.editSelected();
	},

	onClickDelete: function() {
		this.parent.app.deleteSelected();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	}
});