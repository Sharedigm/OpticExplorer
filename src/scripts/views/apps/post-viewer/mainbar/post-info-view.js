/******************************************************************************\
|                                                                              |
|                              post-info-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a post's information.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Directory from '../../../../models/storage/directories/directory.js';
import File from '../../../../models/storage/files/file.js';
import UserPreferences from '../../../../models/preferences/user-preferences.js';
import Posts from '../../../../collections/topics/posts.js';
import BaseView from '../../../../views/base-view.js';
import ItemOpenable from '../../../../views/apps/common/behaviors/opening/item-openable.js';
import PostsListView from '../../../../views/apps/topic-viewer/mainbar/topics/posts/posts-list-view.js';

export default BaseView.extend(_.extend({}, ItemOpenable, {


	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-newspaper"></i><%= topic_name %></h1>

		<div class="content"></div>
	`),

	regions: {
		content: '.content'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.preferences = UserPreferences.create(config.apps.topic_viewer.preferences);
	},

	//
	// getting methods
	//

	getTopicName: function() {

		// get post's topic name
		//
		if (this.model.has('topic_name')) {
			return this.model.get('topic_name');

		// get default topic name
		//
		} else {
			return config.apps.topic_viewer.defaults.topic.name;
		}
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			topic_name: this.getTopicName()
		}
	},

	onRender: function() {

		// show child views
		//
		this.showContent();
	},

	showPost: function() {
		this.preferences.fetch({

			// callbacks
			//
			success: () => {

				// fetch user profile
				//
				this.model.fetch({

					// callbacks
					//
					success: () => {

						// show child views
						//
						this.showContent();
					},

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not find post.",
							response: response
						});
					}
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find preferences.",
					response: response
				});
			}
		});
	},

	showContent: function() {
		this.showChildView('content', new PostsListView({
			collection: new Posts([this.model]),

			// options
			//
			preferences: this.preferences,
			collapsed: false,

			// capabilities
			//
			editable: application.isSignedIn(),

			// callbacks
			//
			onselect: (item) => {
				this.onSelect(item);
			}
		}));
	},

	//
	// file event handling methods
	//

	onSelect: function(item) {
		if (item.model instanceof Directory) {
			this.openDirectory(item.model);
		} else if (item.model instanceof File) {
			this.openFile(item.model);
		}
	}
}));