/******************************************************************************\
|                                                                              |
|                               sidebar-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing an app's sidebar.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topic from '../../../../models/topics/topic.js';
import Post from '../../../../models/topics/post.js';
import Chat from '../../../../models/chats/chat.js';
import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import TopicInfoPanelView from '../../../../views/apps/topic-viewer/sidebar/panels/topic-info-panel-view.js';
import PostInfoPanelView from '../../../../views/apps/post-viewer/sidebar/panels/post-info-panel-view.js';
import TopicsPanelView from '../../../../views/apps/topic-viewer/sidebar/panels/topics-panel-view.js';
import ChatInfoPanelView from '../../../../views/apps/chat-viewer/sidebar/panels/chat-info-panel-view.js';
import ChatsPanelView from '../../../../views/apps/chat-viewer/sidebar/panels/chats-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['info', 'topics', 'chats'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'info': true,
			'topics': isSignedIn,
			'chats': isSignedIn
		};
	},

	//
	// querying methods
	//

	hasTopics: function() {
		return this.hasChildView('topics') && this.getChildView('topics').collection != null;
	},

	//
	// getting methods
	//

	getPostTopic: function(post) {
		if (this.hasChildView('topics')) {
			let topicName = post.get('topic_name') || config.apps.topic_viewer.defaults.topic.name;
			return this.getChildView('topics').collection.getByName(topicName);
		}
	},

	getSelectedTopic: function() {
		if (this.hasChildView('topics')) {
			return this.getChildView('topics').getSelected()[0];
		}
	},

	getSelectedChat: function() {
		if (this.hasChildView('chats')) {
			return this.getChildView('chats').getSelected()[0];
		}
	},

	//
	// setting methods
	//

	setModel: function(model) {
		this.model = model;
		
		// update sidebar
		//
		if (this.isPanelVisible('info')) {
			this.showPanel('info');
		}
	},

	//
	// panel rendering methods
	//

	showPanel: function(panel) {

		// show specified panel
		//
		switch (panel) {
			case 'info':
				this.showInfoPanel();
				break;
			case 'topics':
				this.showTopicsPanel();
				break;
			case 'chats':
				this.showChatsPanel();
				break;
		}
	},

	showInfoPanel: function() {
		if (this.model instanceof Topic) {
			this.showTopicInfoPanel();
		} else if (this.model instanceof Post && this.hasTopics()) {
			this.showPostInfoPanel();
		} else if (this.model instanceof Chat) {
			this.showChatInfoPanel();
		}
	},

	showTopicInfoPanel: function() {
		this.showChildView('info', new TopicInfoPanelView({
			model: this.model instanceof Topic? this.model : undefined,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,
		}));		
	},

	showPostInfoPanel: function() {
		this.showChildView('info', new PostInfoPanelView({
			model: this.model instanceof Post? this.model : undefined,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,
		}));		
	},

	showChatInfoPanel: function() {
		this.showChildView('info', new ChatInfoPanelView({
			model: this.model instanceof Chat? this.model : undefined,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,
		}));		
	},

	showTopicsPanel: function() {
		this.showChildView('topics', new TopicsPanelView({
			model: this.model,
			collection: this.options.topics,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondrop: this.options.ondrop
		}));		
	},

	showChatsPanel: function() {
		this.showChildView('chats', new ChatsPanelView({
			collection: this.options.chats,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondrop: this.options.ondrop
		}));		
	},

	//
	// event handling methods
	//

	onChange: function() {
		if (this.app.model instanceof Topic) {
			this.setTopic(this.app.model);
		} else if (this.app.model instanceof Chat) {
			this.setChat(this.app.model);
		}	
	}
});