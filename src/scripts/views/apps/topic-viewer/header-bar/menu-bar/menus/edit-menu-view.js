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
import EditMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/edit-menu-view.js';

export default EditMenuView.extend({

	//
	// attributes
	//

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

	/*
	visible: function() {
		let selectedItem = this.parent.app.selected? this.parent.app.selected.model : this.parent.app.model;
		
		let isTopicSelected = selectedItem instanceof Topic;
		let isPostSelected = selectedItem instanceof Post;
		let isCommentSelected = selectedItem instanceof Comment;
		let isReplySelected = selectedItem instanceof Reply;
		let isNoneSelected = !isTopicSelected && !isPostSelected && !isCommentSelected && !isReplySelected;

		return {
			'edit-topic': isTopicSelected || isNoneSelected,
			'edit-post': isPostSelected,
			'edit-comment': isCommentSelected,
			'edit-reply': isReplySelected,

			'delete-topic': isTopicSelected || isNoneSelected,
			'delete-post': isPostSelected,
			'delete-comment': isCommentSelected,
			'delete-reply': isReplySelected
		};
	},
	*/

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
			'edit-post': isPostEditable,
			'edit-comment': isCommentEditable,
			'edit-reply': isReplyEditable,

			'delete-topic': isTopicEditable,
			'delete-post': isPostEditable,
			'delete-comment': isCommentEditable,
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