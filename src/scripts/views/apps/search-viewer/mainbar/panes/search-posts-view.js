/******************************************************************************\
|                                                                              |
|                             search-posts-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for displaying post search results.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Posts from '../../../../../collections/topics/posts.js';
import BaseView from '../../../../../views/base-view.js';
import PostsListView from '../../../../../views/apps/topic-viewer/mainbar/topics/posts/posts-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'results',

	template: template(`
		<div class="message well">Searching topic posts...</div>
		<div class="posts"></div>
	`),

	regions: {
		posts: '.posts'
	},

	//
	// querying methods
	//

	numResults: function() {
		return this.collection? this.collection.length : 0;
	},

	//
	// fetching methods
	//

	fetchUserPosts: function(query, user, options) {
		new Posts().fetchPublic({
			data: {
				message: query
			},

			// callbacks
			//
			success: (collection) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(collection);
				}
			}
		});
	},

	fetchPublicPosts: function(search, options) {
		new Posts().fetchPublic({
			data: {
				message: search
			},

			// callbacks
			//
			success: (collection) => {

				// perform callback
				//
				if (options && options.success) {
					options.success(collection);
				}
			}
		});
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.searchFor(this.options.query);
	},

	showMessage: function(message) {
		this.$el.find('.message').text(message);
	},

	showCount: function(count) {
		this.showMessage(count + ' ' + (count == 1? "post was" : "posts were") + " found.");
	},

	searchFor: function(query) {

		// perform search
		//
		if (application.isSignedIn()) {
			this.fetchAndShowUserPosts(query, application.session.user);
		} else {
			this.fetchAndShowPublicPosts(query);
		}
	},

	fetchAndShowUserPosts: function(query, user) {

		// perform search
		//
		this.fetchUserPosts(query, user, {

			// callbacks
			//
			success: (collection) => {
				this.collection = collection;

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// show results
				//
				if (collection.length > 0) {
					this.showPosts();
				}

				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange(collection);
				}
			}
		});
	},

	fetchAndShowPublicPosts: function(query) {

		// perform search
		//
		this.fetchPublicPosts(query, {

			// callbacks
			//
			success: (collection) => {

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// show results
				//
				this.collection = collection
				if (collection.length > 0) {
					this.showPosts();
				}

				// perform callback
				//
				if (this.options.onchange) {
					this.options.onchange(collection);
				}
			}
		});
	},

	showPosts: function() {
		this.showChildView('posts', new PostsListView({
			collection: this.collection,

			// capabilities
			//
			selectable: false,
			editable: false
		}));
	}
});