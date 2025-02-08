/******************************************************************************\
|                                                                              |
|                            shareable-by-topic.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a behavior that allows sharing by discussion topic.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// sharing methods
	//

	showItemByTopic: function(item, topic) {
		application.launch('topic_viewer', {
			model: topic,
			items: [item],
			message: config.apps.file_browser.share_invitation_message
		});
	},

	showItemsByTopic: function(items, topic) {
		application.launch('topic_viewer', {
			model: topic,
			items: items,
			message: config.apps.file_browser.share_invitation_message
		});
	},

	//
	// selection / sharing methods
	//

	shareItemByTopic: function(item) {

		// select topics
		//
		this.showOpenTopicsDialog({

			// callbacks
			//
			onopen: (topics) => {

				// show selected topic and item
				//
				this.showItemByTopic(item, topics[0]);
			}
		});
	},

	shareItemsByTopic: function(items) {

		// select topics
		//
		this.showOpenTopicsDialog({

			// callbacks
			//
			onopen: (topics) => {

				// show selected topic and items
				//
				this.showItemsByTopic(items, topics[0]);
			}
		});
	},

	shareSelectedByTopic: function(options) {
		this.shareItemsByTopic(this.getSelectedModels(), _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareModelByTopic: function(options) {
		this.shareItemByTopic(this.getModel? this.getModel() : this.model, _.extend({}, options, {
			message: config.apps.file_browser.share_invitation_message
		}));
	},

	shareByTopic: function(options) {
		if (this.hasSelected()) {
			this.shareSelectedByTopic(options);
		} else {
			this.shareModelByTopic(options);
		}
	},

	//
	// dialog rendering methods
	//

	showOpenTopicsDialog: function(options) {
		application.loadAppView('topic_viewer', {

			// callbacks
			//
			success: (TopicViewerView) => {
				TopicViewerView.showOpenTopicsDialog({

					// options
					//
					title: "Open Topics",
					subscribed: true,

					// callbacks
					//
					onopen: (items) => {
						if (options && options.onopen) {
							options.onopen(items);
						}
					}
				});
			}
		});
	}
};