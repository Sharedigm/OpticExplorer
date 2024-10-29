/******************************************************************************\
|                                                                              |
|                                  comments.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of comments.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Comment from '../../models/comments/comment.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Comment,

	//
	// fetching methods
	//

	fetchByPost: function(post, options) {
		return this.fetch(_.extend(options, {
			url: post.url() + '/comments'
		}));
	},

	fetchPendingReceivedByUser: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/comments/received/pending'
		}));
	},

	fetchPendingReceivedLikesByUser: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/comments/liked/pending'
		}));
	}
});
