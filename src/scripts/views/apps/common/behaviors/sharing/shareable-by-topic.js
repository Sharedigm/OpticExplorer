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

	shareItemByTopic: function(item) {
		import(
			'../../../../../views/apps/topic-viewer/topic-viewer-view.js'
		).then((TopicViewerView) => {

			// select topics
			//
			this.showOpenSubscribedTopicsDialog({
				model: TopicViewerView.default.default_topic,

				// callbacks
				//
				onopen: (topics) => {

					// show selected topic
					//
					application.showTopic(topics[0], {
						items: [item],
						message: config.apps.file_browser.share_invitation_message
					});
				}
			});
		});
	},

	shareItemsByTopic: function(items) {
		import(
			'../../../../../views/apps/topic-viewer/topic-viewer-view.js'
		).then((TopicViewerView) => {

			// select topics
			//
			this.showOpenSubscribedTopicsDialog({
				model: TopicViewerView.default.default_topic,

				// callbacks
				//
				onopen: (topics) => {
					application.showTopic(topics[0], {
						items: items,
						message: config.apps.file_browser.share_invitation_message
					});
				}
			});
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

	showOpenSubscribedTopicsDialog: function(options) {
		import(
			'../../../../../views/apps/topic-viewer/dialogs/topics/open-topics-dialog-view.js'
		).then((OpenTopicsDialogView) => {

			// show open dialog
			//
			this.show(new OpenTopicsDialogView.default({

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
			}));
		});
	}
};