/******************************************************************************\
|                                                                              |
|                             topic-info-showable.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for showing topic information.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topics from '../../../../../../collections/topics/topics.js';

export default {

	//
	// dialog rendering methods
	//

	showTopicInfoDialog: function(topic, options) {
		import(
			'../../../../../../views/apps/topic-browser/dialogs/info/topic-info-dialog-view.js'
		).then((TopicInfoDialogView) => {

			// show topic info dialog
			//
			this.show(new TopicInfoDialogView.default(_.extend({
				model: topic
			}, options)));				
		});		
	},

	showTopicsInfoDialog: function(topics, options) {

		// show info for a single item
		//
		if (topics.length == 1) {
			this.showTopicInfoDialog(topics[0], options);
			return;
		}

		// show info for multiple items
		//
		import(
			'../../../../../../views/apps/topic-browser/dialogs/info/topics-info-dialog-view.js'
		).then((TopicsInfoDialogView) => {

			// show topics info dialog
			//
			this.show(new TopicsInfoDialogView.default(_.extend({
				collection: new Topics(topics)
			}, options)));				
		});
	}
};