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
		<li role="presentation" class="topic-option">
			<a class="share-topic"><i class="fa fa-hashtag"></i>Topic</a>
		</li>
		
		<li role="presentation" class="like post-option">
			<a class="like post"><i class="fa fa-thumbs-up"></i>Like Post<span class="command shortcut">=</span></a>
		</li>
		
		<li role="presentation" class="reply post-option">
			<a class="reply-to post"><i class="fa fa-comment"></i>Comment on Post<span class="shortcut">enter</span></a>
		</li>
		
		<li role="presentation" class="like comment-option">
			<a class="like comment"><i class="fa fa-thumbs-up"></i>Like Comment<span class="command shortcut">=</span></a>
		</li>
		
		<li role="presentation" class="reply comment-option">
			<a class="reply-to comment"><i class="fa fa-reply"></i>Reply to Comment<span class="shortcut">enter</span></a>
		</li>
		
		<li role="presentation" class="like reply-option">
			<a class="like reply"><i class="fa fa-thumbs-up"></i>Like Reply<span class="command shortcut">=</span></a>
		</li>
		
		<li role="presentation" class="reply reply-option">
			<a class="reply-to reply"><i class="fa fa-reply"></i>Reply to Reply<span class="shortcut">enter</span></a>
		</li>
		
		<li role="separator" class="divider post-option"></li>
		
		<li role="presentation" class="post-option">
			<a class="share-by-topic"><i class="fa fa-newspaper"></i>By Discussion Topic</a>
		</li>
		
		<li role="presentation" class="post-option">
			<a class="share-by-message"><i class="fa fa-comments"></i>By Chat Messsage</a>
		</li>
		
		<li role="separator" class="divider post-option"></li>
		
		<li role="presentation" class="post-option">
			<a class="share-by-link"><i class="fa fa-link"></i>By Link</a>
		</li>
		
		<li role="separator" class="divider topic-option"></li>
		
		<% if (features && features.files) { %>
		<li role="presentation" class="topic-option">
			<a class="share-files"><i class="fa fa-file"></i>Files</a>
		</li>
		<% } %>
		
		<% if (features && features.audio) { %>
		<li role="presentation" class="topic-option">
			<a class="share-audio"><i class="fa fa-volume-up"></i>Audio</a>
		</li>
		<% } %>
		
		<% if (features && features.music) { %>
		<li role="presentation" class="topic-option">
			<a class="share-music"><i class="fa fa-music"></i>Music</a>
		</li>
		<% } %>

		<% if (features && features.pictures) { %>
		<li role="presentation" class="topic-option">
			<a class="share-pictures"><i class="fa fa-image"></i>Pictures</a>
		</li>
		<% } %>
		
		<% if (features && features.video) { %>
		<li role="presentation" class="topic-option">
			<a class="share-videos"><i class="fa fa-video"></i>Videos</a>
		</li>
		<% } %>
		
		<% if (features && features.maps) { %>
		<li role="presentation" class="topic-option">
			<a class="share-maps"><i class="fa fa-map"></i>Maps</a>
		</li>
		<% } %>
		
		<% if (features && features.locations) { %>
		<li role="separator" class="divider topic-option"></li>
		
		<li role="presentation" class="topic-option">
			<a class="share-location"><i class="fa fa-map-marker-alt"></i>Location</a>
		</li>
		<% } %>
	`),

	events: {

		// share topic
		//
		'click .share-topic': 'onClickShareTopic',

		// share post
		//
		'click .share-by-topic': 'onClickShareByTopic',
		'click .share-by-message': 'onClickShareByMessage',
		'click .share-by-link': 'onClickShareByLink',

		// share comment
		//
		'click .like': 'onClickLike',
		'click .reply-to': 'onClickReplyTo',

		// share items
		//
		'click .share-files': 'onClickShareFiles',
		'click .share-audio': 'onClickShareAudio',
		'click .share-music': 'onClickShareMusic',
		'click .share-pictures': 'onClickSharePictures',
		'click .share-videos': 'onClickShareVideos',
		'click .share-maps': 'onClickShareMaps',
		'click .share-location': 'onClickShareLocation'
	},

	//
	// querying methods
	//
	
	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let isRequired = this.parent.app.model instanceof Topic && this.parent.app.model.isRequired();

		return {
			'share-topic': isSignedIn && !isRequired
		};
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
		switch (mode) {
			case 'topic':
				this.$el.find('.topic-option').show();
				this.$el.find('.post-option').hide();
				this.$el.find('.comment-option').hide();
				this.$el.find('.reply-option').hide();
				break;
			case 'post':
				this.$el.find('.topic-option').hide();
				this.$el.find('.post-option').show();
				this.$el.find('.comment-option').hide();
				this.$el.find('.reply-option').hide();
				break;
			case 'comment':
				this.$el.find('.topic-option').hide();
				this.$el.find('.post-option').hide();
				this.$el.find('.comment-option').show();
				this.$el.find('.reply-option').hide();
				break;
			case 'reply':
				this.$el.find('.topic-option').hide();
				this.$el.find('.post-option').hide();
				this.$el.find('.comment-option').hide();
				this.$el.find('.reply-option').show();
				break;
			default:
				this.$el.find('.topic-option').hide();
				this.$el.find('.post-option').hide();
				this.$el.find('.comment-option').hide();
				this.$el.find('.reply-option').hide();
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			features: config.apps.topic_viewer.features
		}
	},

	onRender: function() {

		// hide items not pertaining to topic
		//
		this.$el.find('.post-option').hide();
		this.$el.find('.comment-option').hide();
		this.$el.find('.reply-option').hide();

		// call superclass method
		//
		MenuView.prototype.onRender.call(this);
	},

	update: function() {

		// call superclass method
		//
		MenuView.prototype.update.call(this);

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
		this.parent.app.showTopicInvitationsDialog(this.parent.app.model);
	},

	onClickLike: function() {
		this.parent.app.selected.like();
	},

	onClickReplyTo: function() {
		this.parent.app.selected.reply();
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

	onClickShareFiles: function() {
		this.parent.app.shareItems();
	},

	onClickShareAudio: function() {
		this.parent.app.shareAudio();
	},

	onClickShareMusic: function() {
		this.parent.app.shareMusic();
	},

	onClickSharePictures: function() {
		this.parent.app.sharePictures();
	},

	onClickShareVideos: function() {
		this.parent.app.shareVideos();
	},

	onClickShareMaps: function() {
		this.parent.app.shareMaps();
	},

	onClickShareLocation: function() {
		this.parent.app.shareLocation();
	}
});