/******************************************************************************\
|                                                                              |
|                                 topic-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing a topic's posts.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Post from '../../../../../models/topics/post.js';
import Posts from '../../../../../collections/topics/posts.js';
import Items from '../../../../../collections/storage/items.js';
import BaseView from '../../../../../views/base-view.js';
import SelectableContainable from '../../../../../views/behaviors/containers/selectable-containable.js';
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import PostFormView from '../../../../../views/apps/post-viewer/forms/posts/post-form-view.js';
import PostsListView from '../../../../../views/apps/topic-viewer/mainbar/topics/posts/posts-list-view.js';
import PagerView from '../../../../../views/apps/common/mainbar/pager/pager-view.js';

export default BaseView.extend(_.extend({}, SelectableContainable, Timeable, {

	//
	// attributes
	//

	className: 'topic',

	template: template(`
		<div class="new-post panel"></div>
		<div class="posts-list"></div>
		<div class="pager"></div>
	`),

	regions: {
		form: '.new-post',
		posts: '.posts-list',
		pager: {
			el: '.pager',
			replaceElement: true
		}
	},

	events: {
		'mousedown': 'onMouseDown',
		'change .privacy input': 'onChangePrivacy'
	},

	// update every 10 seconds
	//
	updateInterval: 1000 * 10,
	
	// redraw elapsed times every minute
	//
	redrawInterval: 1000 * 60,

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.editable == undefined) {
			this.options.editable = (application.isSignedIn());
		}

		// set attributes
		//
		this.post = new Post({
			topic_id: this.model? this.model.get('id') : null,
			message: this.options? this.options.message : null,
			public: this.options.preferences? this.options.preferences.get('default_privacy') == 'public' : 'protected',
			attachments: new Items(this.options.items),
			check_in: this.options.check_in
		});
		this.collection = new Posts();

		// set options
		//
		if (this.options.preferences) {
			if (this.options.collapsed == undefined) {
				this.options.collapsed = !this.options.preferences.get('show_comments');
			}
			if (this.options.condensed == undefined) {
				this.options.condensed = !this.options.preferences.get('show_options');
			}
			if (this.options.posts_per_page == undefined) {
				this.options.posts_per_page = this.options.preferences.get('posts_per_page');
			}
			if (this.options.posts_direction == undefined) {
				this.options.posts_direction = this.options.preferences.get('posts_direction');
			}
			if (this.options.show_elapsed_time == undefined) {
				this.options.show_elapsed_time = this.options.preferences.get('show_elapsed_time');
			}
		}

		// listen for changes in collection
		//
		this.listenTo(this.collection, 'add', this.onAdd);
		this.listenTo(this.collection, 'remove', this.onRemove);
	},

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('posts')) {
			this.getChildView('posts').each(callback, filter, options);
		}
	},

	//
	// querying methods
	//

	isPublic: function() {
		if (this.hasChildView('form')) {
			return this.getChildView('form').getValue('public');
		} else {
			return this.options.privacy == 'public';
		}
	},

	//
	// counting methods
	//

	numPosts: function() {
		if (this.hasChildView('posts')) {
			return this.getChildView('posts').children.length;
		}
	},

	//
	// getting methods
	//

	getPrivacy: function() {
		if (this.isPublic()) {
			return 'public';
		} else {
			return 'protected';
		}
	},

	getRange: function() {
		return this.getChildView('pager').getRange();
	},

	getPostsPerPage: function() {
		return this.getChildView('pager').getItemsPerPage();
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {

			// topic options
			//
			case 'posts_per_page':
				this.options.posts_per_page = value;

				// update posts list
				//
				this.fetchAndShowPosts(this.model, {
					public: this.isPublic()
				});
				break;

			case 'posts_direction':
				this.options.posts_direction = value;

				// update posts list
				//
				this.setDirection(value);
				break;

			case 'show_elapsed_time':
				this.options.show_elapsed_time = value;

				// update view
				//
				this.showPosts();
				break;
		}
	},

	setModel: function(model) {
		this.setTopic(model);
	},

	setTopic: function(topic) {

		// clear previous topic
		//
		this.reset();

		// set attributes
		//
		this.model = topic;

		// set topic of new post
		//
		this.post.set('topic_id', topic? topic.get('id') : null);

		// show topic posts
		//
		this.fetchAndShowPosts(this.model, {
			public: this.isPublic()
		});
	},

	setPostsPerPage: function(postsPerPage) {
		if (postsPerPage != this.getPostsPerPage()) {
			this.getChildView('pager').setItemsPerPage(postsPerPage);

			// update topic posts
			//
			this.fetchAndShowPosts(this.model, {
				public: this.isPublic()
			});
		}
	},

	setMessage: function(message) {
		this.getChildView('form').setValue('message', message);
	},

	setPrivacy: function(privacy) {
		if (this.hasChildView('form')) {
			this.getChildView('form').setValue('privacy', privacy);
		} else {
			this.options.privacy = privacy;
		}
		this.onChangePrivacy();
	},

	setCollection: function(collection) {
		this.collection = collection;

		// update pager
		//
		this.getChildView('pager').setNumPageItems(collection.length);
	},

	setCollapsed: function(collapsed) {
		if (collapsed) {
			this.$el.find('.collapsable').addClass('collapsed');
		} else {
			this.$el.find('.collapsed').removeClass('collapsed');
		}
	},

	setCondensed: function(condensed) {
		if (condensed) {
			this.$el.addClass('options-hidden');
		} else {
			this.$el.removeClass('options-hidden');
		}
	},

	setDirection: function(direction) {
		switch (direction) {
			case 'bottom_up':
				this.$el.addClass('bottom-up');
				break;
			case 'top_down':
				this.$el.removeClass('bottom-up');
				break;
		}
	},

	clearMessages: function() {
		this.collection.reset();

		// update message
		//
		this.$el.find('.empty.post.panel').html('Loading...');
	},

	resetMessages: function() {

		// clear current collection
		//
		this.clearMessages();

		// abort request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}

		// clear elapsed time interval
		//
		this.clearInterval();

		// clear update timeout
		//
		this.clearTimeout();
	},

	reset: function() {
		this.resetMessages();

		// clean up soft deleted posts
		//
		// this.collection.updateByTopic(this.model);
	},

	//
	// sharing methods
	//

	shareItems: function(options) {
		this.getChildView('form').showOpenFilesDialog(options);
	},

	shareLocation: function(options) {
		this.getChildView('form').checkIn(options);
	},

	//
	// list editing methods
	//

	addNewPost: function(post) {

		// add new post to list
		//
		this.addPost(post);

		// play add sound
		//
		application.play('add');
	},

	addPost: function(post) {

		// add post to list
		//
		this.collection.add(post, {
			at: 0
		});

		// update last date
		//
		if (!this.lastDate || post.get('created_at').getTime() > this.lastDate.getTime()) {
			this.lastDate = post.get('created_at');
		}
	},

	updatePost: function(post) {

		// update item
		//
		let item = this.collection.get(post.get('id'));
		if (item) {
			item.set(post.attributes);
		}

		// update last date
		//
		if (!this.lastDate || post.get('updated_at').getTime() > this.lastDate.getTime()) {
			this.lastDate = post.get('updated_at');
		}
	},

	deletePost: function(post) {

		// delete item
		//
		let item = this.collection.get(post.get('id'));
		if (item) {
			this.collection.remove(item);
		}

		// update last date
		//
		if (!this.lastDate || post.get('deleted_at').getTime() > this.lastDate.getTime()) {
			this.lastDate = post.get('deleted_at');
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		if (this.options.editable) {
			this.showNewPostForm(this.model);
		}
		this.showNavBar();
		this.fetchAndShowPosts(this.model, {
			public: this.isPublic()
		});

		// set posts direction
		//
		if (this.options.preferences) {
			this.setDirection(this.options.preferences.get('posts_direction'));
		}
	},

	showNewPostForm: function() {
		this.showChildView('form', new PostFormView({
			model: this.post,

			// options
			//
			preferences: this.options.preferences,

			// capabilities
			//
			submitable: true,
			cancelable: false,

			// callbacks
			//
			onsubmit: (post) => this.addNewPost(post)
		}));
	},

	fetchAndShowPosts: function(topic) {
		let range = this.getRange();

		// fetch selected posts
		//
		this.request = this.collection.fetchByTopic(topic, {

			// parameters
			//
			data: _.extend(range, this.options.search, {
				language: this.options.preferences.get('translation')? this.options.preferences.get('language') : undefined
			}),

			// callbacks
			//
			success: (collection) => {
				this.request = null;

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

				// start periodic updating
				//
				// this.startUpdating(topic, options);

				// perform callback
				//
				if (this.options.onload) {
					this.options.onload(this);
				}
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not find posts.",
					response: response
				});
			}
		});
	},

	showPosts: function() {
		this.showChildView('posts', new PostsListView({
			collection: this.collection,

			// options
			//
			multicolumn: false,
			show_elapsed_time: this.options.show_elapsed_time,
			preferences: this.options.preferences,

			// state
			//
			collapsed: this.options.collapsed,
			condensed: this.options.condensed,

			// capabilities
			//
			editable: this.options.editable,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondelete: this.options.ondelete
		}));
	},

	showNavBar: function() {
		this.showChildView('pager', new PagerView({
			collection: this.collection,

			// options
			//
			item_type: 'posts',
			items_per_page: this.options.posts_per_page,

			// callbacks
			//
			onchange: (pageNumber) => {

				// hide / show new post form
				//
				let newPostView = this.getChildView('form');
				if (newPostView) {
					if (pageNumber == 1) {
						newPostView.$el.parent().removeClass('hidden');
					} else {
						newPostView.$el.parent().addClass('hidden');
					}
				}

				// clear list
				//
				if (this.hasChildView('posts')) {
					this.getChildView('posts').destroy();
				}

				// update posts list
				//
				this.fetchAndShowPosts(this.model, {
					public: this.isPublic()
				});

				// scroll to top
				//
				if (newPostView && pageNumber == 1) {
					newPostView.focus();
				}
			}
		}));
	},

	//
	// updating methods
	//

	startUpdating: function(topic, options) {

		// update elapsed times
		//
		this.setInterval(() => {
			this.getChildView('posts').update();
		}, this.redrawInterval);

		// save date of most recent change
		//
		if (this.collection.length > 0) {
			/*
			let lastDate = collection.getUpdateDate();
			if (!this.lastDate || lastDate.getTime() > this.lastDate.getTime()) {
				this.lastDate = lastDate;
			}
			*/
			this.lastDate = new Date();
		}

		// schedule next update
		//
		this.setTimeout(() => {
			this.updatePosts(topic, options);
		}, this.updateInterval);
	},

	updatePosts: function(topic, options) {

		// skip updating if not visible
		//
		let desktopView = this.getParentView('desktop');
		if (desktopView && !desktopView.isCurrent()) {
			this.setTimeout(() => {
				this.updatePosts(topic, options);
			}, this.updateInterval);
			return;
		}

		// fetch topic posts since last
		//
		this.request = new Posts().fetchByTopic(topic, {

			// parameters
			//
			data: _.extend({}, this.options.search, {
				after: this.lastDate? this.lastDate.format('yyyy-mm-dd HH:MM:ss', false) : undefined,
				// public: options && options.public != undefined? options.public : undefined,
				language: this.options.preferences.get('translation')? this.options.preferences.get('language') : undefined
			}),
			updates: true,

			// callbacks
			//
			success: (collection) => {
				this.request = null;

				// check if view still exists
				//
				if (this.isDestroyed()) {
					return;
				}

				// check for new posts
				//
				if (collection.length > 0) {

					// update collection
					//
					for (let i = 0; i < collection.length; i++) {
						let model = collection.at(i);

						if (model.hasDeleteDate()) {
							this.deletePost(model);
						} else if (model.isUpdated()) {
							this.updatePost(model);
						} else {
							this.addPost(model);
						}
					}

					// play add sound
					//
					application.play('add');
				}

				// schedule next update
				//
				this.setTimeout(() => {
					this.updatePosts(topic, options);
				}, this.updateInterval);
			}
		});
	},

	//
	// mouse event handling methods
	//

	onChangePrivacy: function() {

		// clear previous message settings
		//
		// this.resetMessages();

		// update posts list
		//
		/*
		this.fetchAndShowPosts(this.model, {
			public: this.isPublic()
		});
		*/
	},

	//
	// event handling methods
	//

	onAdd: function(model) {

		// perform callback
		//
		if (this.options.onadd) {
			this.options.onadd(model);
		}
	},

	onRemove: function(model) {

		// perform callback
		//
		if (this.options.onremove) {
			this.options.onremove(model);
		}
	},

	//
	// keyboard event handling methods
	//

	onKeyDown: function(event) {
		if (this.hasChildView('form')) {
			this.getChildView('form').onKeyDown(event);
		}
		if (this.hasChildView('posts')) {
			this.getChildView('posts').onKeyDown(event);
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.reset();

		// abort pending request
		//
		if (this.request && this.request.state() == 'pending') {
			this.request.abort();
		}
	}
}));