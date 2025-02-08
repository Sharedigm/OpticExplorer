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

import SideBarView from '../../../../views/apps/common/sidebar/sidebar-view.js';
import TopicInfoPanelView from '../../../../views/apps/topic-viewer/sidebar/panels/topic-info-panel-view.js';
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
		this.showChildView('info', new TopicInfoPanelView({
			model: this.model,

			// options
			//
			view_kind: this.options.info_kind != 'auto'? this.options.info_kind : this.options.view_kind,
		}));		
	},

	showTopicsPanel: function() {
		this.showChildView('topics', new TopicsPanelView({
			post: this.options.post,
			defaultTopic: this.app.getDefaultTopic(),
			collection: this.collection,

			// options
			//
			view_kind: this.options.view_kind,

			// callbacks
			//
			onload: (topics) => this.onLoad(topics),
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondrop: this.options.ondrop
		}));		
	},

	onLoad: function(topics) {

		// set attributes
		//
		this.model = topics.at(0);

		// update view
		//
		this.showInfoPanel();
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