/******************************************************************************\
|                                                                              |
|                              user-info-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a user's information.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connection from '../../../../models/users/connections/connection.js';
import Post from '../../../../models/topics/post.js';
import Directory from '../../../../models/storage/directories/directory.js';
import File from '../../../../models/storage/files/file.js';
import UserProfile from '../../../../models/users/profile/user-profile.js';
import BaseView from '../../../../views/base-view.js';
import UserPanelsView from '../../../../views/apps/profile-viewer/mainbar/user-panels-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-user"></i><%= name %></h1>
		
		<div class="content"></div>
	`),

	regions: {
		content: '.content'
	},

	events: {
		'keydown': 'onKeyDown'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.model.get('full_name')
		};
	},

	onRender: function() {

		// fetch user profile
		//
		new UserProfile().fetchByUser(this.model, {

			// callbacks
			//
			success: (model) => {
				this.profile = model;

				// show child views
				//
				this.showContent(this.options.nav || 'profile');
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find user's profile.",
					response: response
				});
			}
		});
	},

	showContent: function() {
		this.showChildView('content', new UserPanelsView({
			model: this.model,

			// options
			//
			profile: this.profile,
			nav: this.options.nav || 'profile',
			tab: this.options.tab,
			editable: false,
			public: this.options.public,
			preferences: this.options.preferences,

			// callbacks
			//
			onopen: (item) => {
				this.onOpen(item);
			},
			onclicktab: (tab) => {

				// perform callback
				//
				if (this.options.onclicktab) {
					this.options.onclicktab(tab);
				}
			}
		}));
	},

	//
	// event handling methods
	//

	onOpen: function(item) {
		if (item.model instanceof Connection) {

			// show connection's profile info
			//
			application.showUser(item.model);
		} else if (item.model instanceof Post) {

			// show post
			//
			application.showPost(item.model);
		} else if (item.model instanceof Directory) {

			// open directory
			//
			application.openDirectory(item.model);
		} else if (item.model instanceof File) {

			// open file
			//
			application.openFile(item.model);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		this.getChildView('content').onKeyDown(event);
	}
});
