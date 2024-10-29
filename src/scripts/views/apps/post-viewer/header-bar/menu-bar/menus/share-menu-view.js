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
import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" class="like post-option" style="display:none">
			<a class="like-post"><i class="fa fa-thumbs-up"></i>Like Post<span class="command shortcut">+</span></a>
		</li>
		
		<li role="presentation" class="reply post-option" style="display:none">
			<a class="reply-to-post"><i class="fa fa-comment"></i>Comment on Post<span class="shortcut"><i class="fa fa-caret-square-o-right"></i></span></a>
		</li>
		
		<li role="presentation" class="like comment-option" style="display:none">
			<a class="like-comment"><i class="fa fa-thumbs-up"></i>Like Comment<span class="command shortcut">+</span></a>
		</li>
		
		<li role="presentation" class="reply comment-option" style="display:none">
			<a class="reply-to-comment"><i class="fa fa-reply"></i>Reply to Comment<span class="shortcut"><i class="fa fa-caret-square-o-right"></i></span></a>
		</li>
		
		<li role="presentation" class="like reply-option" style="display:none">
			<a class="like-reply"><i class="fa fa-thumbs-up"></i>Like Reply<span class="command shortcut">+</span></a>
		</li>
		
		<li role="presentation" class="reply reply-option" style="display:none">
			<a class="reply-to-reply"><i class="fa fa-reply"></i>Reply to Reply<span class="shortcut"><i class="fa fa-caret-square-o-right"></i></span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="share-by-topic"><i class="fa fa-newspaper"></i>By Discussion Topic</a>
		</li>
		
		<li role="presentation">
			<a class="share-by-message"><i class="fa fa-comments"></i>By Chat Messsage</a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="share-by-link"><i class="fa fa-link"></i>By Link</a>
		</li>
	`),

	events: {
		'click .like-post': 'onClickLikeItem',
		'click .like-comment': 'onClickLikeItem',
		'click .like-reply': 'onClickLikeItem',

		'click .reply-to-post': 'onClickReplyToItem',
		'click .reply-to-comment': 'onClickReplyToItem',
		'click .reply-to-reply': 'onClickReplyToItem',

		// share with connections
		//
		'click .share-by-message': 'onClickShareByMessage',

		// share with anyone
		//
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail',

		// share with everyone
		//
		'click .share-by-topic': 'onClickShareByTopic'
	},

	//
	// querying methods
	//

	disabled: function() {
		if (application.isSignedIn()) {
			return {
				'share-by-link': false
			};
		} else {
			return {
				'share-topic-by-invitation': true,
				'share-by-link': false
			};
		}
	},

	//
	// selection event handling methods
	//

	onSelect: function(view) {
		let model = view.model;
		if (model instanceof Topic) {
			this.$el.find('.topic-option').show();
			this.$el.find('.post-option').hide();
			this.$el.find('.comment-option').hide();
			this.$el.find('.reply-option').hide();
		} else if (model instanceof Post) {
			this.$el.find('.topic-option').hide();
			this.$el.find('.post-option').show();
			this.$el.find('.comment-option').hide();
			this.$el.find('.reply-option').hide();
		} else if (model instanceof Comment) {
			this.$el.find('.topic-option').hide();
			this.$el.find('.post-option').hide();
			this.$el.find('.comment-option').show();
			this.$el.find('.reply-option').hide();
		} else if (model instanceof Reply) {
			this.$el.find('.topic-option').hide();
			this.$el.find('.post-option').hide();
			this.$el.find('.comment-option').hide();
			this.$el.find('.reply-option').show();
		} else {
			this.$el.find('.topic-option').hide();
			this.$el.find('.post-option').hide();
			this.$el.find('.comment-option').hide();
			this.$el.find('.reply-option').hide();
		}

		// set enabled / disabled state
		//
		let likeable = model.isLikeableByCurrentUser();
		if (likeable) {
			this.$el.find('li.like').removeClass('disabled');
		} else {
			this.$el.find('li.like').addClass('disabled');
		}
	},

	onDeselect: function() {
		this.$el.find('.topic-option').show();
		this.$el.find('.post-option').hide();
		this.$el.find('.comment-option').hide();
		this.$el.find('.reply-option').hide();
	},
	
	//
	// mouse event handling methods
	//

	onClickLikeItem: function() {
		this.parent.app.selected.like();
	},

	onClickReplyToItem: function() {
		this.parent.app.selected.reply();
	},

	onClickShareByMessage: function() {
		this.parent.app.shareByMessage();
	},

	onClickShareByLink: function() {
		this.parent.app.shareByLink();
	},

	onClickShareByEmail: function() {
		this.parent.app.shareByEmail();
	},

	onClickShareByTopic: function() {
		this.parent.app.shareByTopic();
	}
});