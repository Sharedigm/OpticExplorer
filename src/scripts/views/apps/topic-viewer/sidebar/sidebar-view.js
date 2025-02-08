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
import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import TopicInfoPanelView from '../../../../views/apps/topic-viewer/sidebar/panels/topic-info-panel-view.js';
import PostInfoPanelView from '../../../../views/apps/post-viewer/sidebar/panels/post-info-panel-view.js';
import TopicsPanelView from '../../../../views/apps/topic-viewer/sidebar/panels/topics-panel-view.js';

export default SideBarView.extend({

	//
	// attributes
	//

	panels: ['info', 'topics'],

	//
	// attribute methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();

		return {
			'info': isSignedIn,
			'topics': isSignedIn
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

	//
	// setting methods
	//

	setTopic: function(topic) {

		// set attributes
		//
		this.model = topic;

		// update child views
		//
		if (this.isPanelVisible('info')) {
			this.showPanel('info');
		}

		// set selected
		//
		// this.getChildView('topics').setSelectedModel(topic);

		// scroll into view
		//
		// this.scrollToView(this.findByModel(topic));
	},

	setSelected: function(model, options) {
		this.getChildView('topics').setSelectedModel(model, options);

		// scroll into view
		//
		this.scrollToView(this.getTopic()[0]);
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
		}
	},

	showInfoPanel: function() {
		if (this.model instanceof Topic) {
			this.showTopicInfoPanel();
		} else if (this.model instanceof Post) {
			this.showPostInfoPanel();
		}
	},

	showTopicInfoPanel: function() {
		this.showChildView('info', new TopicInfoPanelView({
			model: this.model,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,
		}));		
	},

	showPostInfoPanel: function() {
		this.showChildView('info', new PostInfoPanelView({
			model: this.model,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,
		}));		
	},

	showTopicsPanel: function() {
		this.showChildView('topics', new TopicsPanelView({
			model: this.model,
			collection: this.collection,

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
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
});