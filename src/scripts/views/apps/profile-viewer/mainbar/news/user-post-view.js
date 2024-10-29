/******************************************************************************\
|                                                                              |
|                              user-post-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a single user post.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import PostView from '../../../../../views/apps/topic-viewer/mainbar/topics/posts/lists/post-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1><i class="fa fa-newspaper"></i>Post</h1>
			
		<div class="content">
			<div class="panel">
				<ul class="posts panels"></ul>
			</div>
		</div>
		
		<div class="buttons visible-xs">
			<button class="cancel btn btn-lg">
				<i class="fa fa-xmark"></i>Cancel
			</button> 
		</div>
	`),
	
	regions: {
		posts: '.posts'
	},

	events: {
		'click > .buttons .cancel': 'onClickCancel'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showUserPost();
	},

	showUserPost: function() {
		this.showChildView('posts', new PostView({
			model: this.model,
			collapsed: false,
			preferences: this.options.preferences
		}));
	},

	//
	// mouse event handling methods
	//

	onClickCancel: function() {

		// go to home view
		//
		application.navigate('#home', {
			trigger: true
		});	
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('post')) {
			this.getChildView('post').onKeyDown(event);
		}
		if (this.hasChildView('posts')) {
			this.getChildView('posts').onKeyDown(event);
		}
	}
});
