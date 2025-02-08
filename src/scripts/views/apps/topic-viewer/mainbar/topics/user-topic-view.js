/******************************************************************************\
|                                                                              |
|                              user-topic-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's news posts.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import TopicView from '../../../../../views/apps/topic-viewer/mainbar/topics/topic-view.js';

export default TopicView.extend({

	//
	// rendering methods
	//

	fetchAndShowPosts: function(options) {
		let data = {
			range: this.getRange()
		};

		// add privacy flag
		//
		if (options && options.public) {
			data.public = true;
		}

		// add search terms
		//
		if (this.options.search) {
			data = _.extend(data, this.options.search);
		}

		// fetch user's posts
		//
		this.request = this.collection.fetchByUser(this.options.user, {
			data: data,
			
			// callbacks
			//
			success: (collection) => {

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// update attributes
				//
				this.setCollection(collection);

				// show list view
				//
				this.showPosts();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's posts.",
					response: response
				});
			}
		});	
	}
});