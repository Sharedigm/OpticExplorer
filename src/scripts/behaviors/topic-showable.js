/******************************************************************************\
|                                                                              |
|                              topic-showable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying topics.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topics from '../collections/topics/topics.js';

export default {

	//
	// getting methods
	//

	getTopicViewer: function() {

		// use topic viewer app
		//
		if (!config.apps.topic_viewer.hidden) {
			return 'topic_viewer';

		// use message viewer app
		//
		} else if (!config.apps.communicator.hidden) {
			return 'communicator';
		}
	},

	//
	// topic showing methods
	//

	showTopic: function(topic, options) {
		let appName = this.getTopicViewer();

		if (this.desktop) {
			if (this.desktop.hasApp(appName)) {

				// open in desktop
				//
				this.desktop.setApp(appName, () => {
					this.desktop.getAppView(appName).openTopic(topic, options);
				});
			} else if (appName) {

				// open in new window
				//
				this.launch(appName, _.extend({}, options, {
					model: topic
				}));
			}
		} else {

			// open in new page
			//
			application.showUrl(topic.getUrl());
		}
	},

	showTopics: function(topics, options) {
		let appName = this.getTopicViewer();

		if (this.desktop.hasApp(appName)) {

			// open in desktop
			//
			this.desktop.setApp(appName, () => {
				this.desktop.getAppView(appName).openTopics(topics, options);
			});
		} else {

			// open in new window
			//
			this.launch(appName, _.extend({}, options, {
				collection: new Topics(topics)
			}));
		}
	}
};