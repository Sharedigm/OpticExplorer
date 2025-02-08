/******************************************************************************\
|                                                                              |
|                                   comment.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a comment on a post.                          |
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
import User from '../../models/users/user.js';
import Items from '../../collections/storage/items.js';
import Replies from '../../collections/comments/replies.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		user: undefined,
		post_id: undefined,
		message: undefined,

		// reactions
		//
		likes: [],
		num_likes: 0,
		replies: []
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/comments',

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
		if (data.replies) {
			data.replies = new Replies(data.replies, {
				parse: true
			});
		}

		return data;
	}
});