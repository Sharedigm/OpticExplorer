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
	`),

	events: {

		// topic options
		//
		'click .edit-topic': 'onClickEdit',
		'click .edit-post': 'onClickEdit',
		'click .edit-comment': 'onClickEdit',
		'click .edit-reply': 'onClickEdit',

		'click .delete-topic': 'onClickDelete',
		'click .delete-post': 'onClickDelete',
		'click .delete-comment': 'onClickDelete',
		'click .delete-reply': 'onClickDelete'
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
		let isNoneSelected = !isTopicSelected && !isPostSelected && !isCommentSelected && !isReplySelected;

		return {
			'edit-topic': isTopicSelected || isNoneSelected,
			'delete-topic': isTopicSelected || isNoneSelected,
			'edit-post': isPostSelected,
			'delete-post': isPostSelected,
			'edit-comment': isCommentSelected,
			'delete-comment': isCommentSelected,
			'edit-reply': isReplySelected,
			'delete-reply': isReplySelected
		};
	},

	enabled: function() {
		let selectedItem = this.parent.app.selected? this.parent.app.selected.model : this.parent.app.model;
		
		let isTopicSelected = selectedItem instanceof Topic;
		let isPostSelected = selectedItem instanceof Post;
		let isCommentSelected = selectedItem instanceof Comment;
		let isReplySelected = selectedItem instanceof Reply;

		let isItemEditable = selectedItem && selectedItem.isOwnedBy && selectedItem.isOwnedBy(application.session.user);
		let isTopicEditable = isTopicSelected && isItemEditable;
		let isPostEditable = isPostSelected && isItemEditable;
		let isCommentEditable = isCommentSelected && isItemEditable;
		let isReplyEditable = isReplySelected && isItemEditable;

		return {
			'edit-topic': isTopicEditable,
			'delete-topic': isTopicEditable,
			'edit-post': isPostEditable,
			'delete-post': isPostEditable,
			'edit-comment': isCommentEditable,
			'delete-comment': isCommentEditable,
			'edit-reply': isReplyEditable,
			'delete-reply': isReplyEditable
		};
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