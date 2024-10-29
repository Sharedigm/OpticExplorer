/******************************************************************************\
|                                                                              |
|                              link-shareable.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for views that deal with sharable items       |
|        (files and directories).                                              |
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

	shareLinkByTopic: function(url, options) {
		import(
			'../../../../../views/apps/topic-viewer/topic-viewer-view.js'
		).then((TopicViewerView) => {

			// show default topic
			//
			application.showTopic(TopicViewerView.default.default_topic, {
				message: (options && options.message? options.message : '') + url,
				privacy: options? options.privacy : null
			});
		});
	},

	shareLinkByMessage: function(url, options) {
		import(
			'../../../../../collections/chats/chats.js'
		).then((Chats) => {
			new Chats.default().fetch({

				// callbacks
				//
				success: (collection) => {

					// show first chat
					//
					application.showChat(collection.at(0), {
						message: (options && options.message? options.message : '') + url
					});
				}
			});
		});
	},

	//
	// dialog rendering methods
	//

	showShareByLinkDialog: function(url) {
		import(
			'../../../../../views/apps/web-browser/dialogs/links/copy-link-dialog-view.js'
		).then((CopyLinkDialogView) => {

			// show copy link dialog
			//
			this.show(new CopyLinkDialogView.default({
				url: url
			}));				
		});		
	}
}