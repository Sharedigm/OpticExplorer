/******************************************************************************\
|                                                                              |
|                                    post.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a post.                                       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Timestamped from '../../models/utilities/timestamped.js';
import Topic from '../../models/topics/topic.js';
import User from '../../models/users/user.js';
import CheckIn from '../../models/places/check-in.js';
import Items from '../../collections/storage/items.js';
import Comments from '../../collections/comments/comments.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		user: undefined,
		message: undefined,
		public: true,

		// reactions
		//
		likes: [],
		num_likes: 0,
		comments: []
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/posts',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return this.has('user')? this.get('user').is(user) : false;
	},

	isLikedByCurrentUser: function() {
		if (this.has('likes')) {
			let likes = this.get('likes');
			return likes.length > 0 && likes[0] == 'you';
		} else {
			return false;
		}
	},

	isLikeableByCurrentUser: function() {
		return !this.isOwnedBy(application.session.user) && !this.isLikedByCurrentUser();
	},

	isUnlikeableByCurrentUser: function() {
		// return !this.isOwnedBy(application.session.user) && this.isLikedByCurrentUser();
		return false;
	},

	hasThumbnail: function() {
		return false;
	},

	//
	// getting methods
	//

	getMessage: function(options) {
		let message = this.get('message');
		if (options && options.max_words) {
			let words = message.split(' ');
			let maxWords = Math.min(options.max_words, words.length);
			let firstWords = words.splice(0, maxWords);
			message = firstWords.join(' ');
			if (words.length > options.max_words) {
				message += '...';
			}
		}
		return message;
	},

	getIcon: function() {
		return '<i class="fa fa-newspaper"></i>';
	},

	getName: function() {
		return this.getMessage({
			// max_words: 3
		});
	},

	getTopic: function() {
		return new Topic({
			id: this.get('topic_id'),
			name: this.get('topic_name') || config.apps.topic_viewer.defaults.topic.name,
			icon_path: config.apps.topic_viewer.defaults.topic.icon_path
		});
	},

	getUrl: function() {
		return application.getUrl() + '#posts/' + this.get('id');
	},

	//
	// setting methods
	//

	setTopic: function(topic, options) {
		this.save({
			topic_id: topic.get('id')
		}, {

			// callbacks
			//
			success: (model) => {

				// if post has been moved to a topic other
				// than the current one, then remove from list.
				//
				if (topic.get('id') != this.get('id')) {
					this.collection.remove(this);
				}

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			},

			error: (response) => {

				// perform callback
				//
				if (options && options.error) {
					options.error(response);
				}			
			}
		});
	},

	//
	// liking methods
	//

	like: function(options) {
		return this.save(undefined, _.extend(options, {
			url: this.url() + '/like',
			type: 'PUT'			
		}));
	},

	acceptLikes: function(options) {
		return this.save(undefined, _.extend(options, {
			url: this.url() + '/likes/accept',
			type: 'PUT'			
		}));
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.user) {
			data.user = new User(data.user, {
				parse: true
			});
		}
		if (data.attachments) {
			data.attachments = new Items(data.attachments, {
				parse: true
			});
		}
		if (data.check_in) {
			data.check_in = new CheckIn(data.check_in, {
				parse: true
			});
		}
		if (data.comments) {
			data.comments = new Comments(data.comments, {
				parse: true
			});
		}

		return data;
	}
});