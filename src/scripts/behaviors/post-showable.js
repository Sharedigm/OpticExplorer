/******************************************************************************\
|                                                                              |
|                               post-showable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying posts.                         |
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
	// getting methods
	//

	getPostViewer: function() {

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
	// post showing methods
	//

	showPost: function(post, options) {
		let appName = this.getPostViewer();

		if (this.desktop) {
			if (this.desktop.hasApp(appName)) {

				// open in desktop
				//
				this.desktop.setApp(appName, () => {
					this.desktop.getAppView(appName).openPost(post, options);
				});
			} else {

				// open in new window
				//
				this.launch(appName, _.extend({}, options, {
					model: post
				}));
			}
		} else {

			// open new page
			//
			application.showUrl(post.getUrl(), '_blank');
		}
	}
};