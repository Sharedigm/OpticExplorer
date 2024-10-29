/******************************************************************************\
|                                                                              |
|                                   replies.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of replies.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Reply from '../../models/comments/reply.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Reply,

	//
	// fetching methods
	//

	fetchByItem: function(item, options) {
		return this.fetch(_.extend(options, {
			url: item.url() + '/replies'
		}));
	},

	fetchPendingReceivedByUser: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/replies/received/pending'
		}));
	},

	fetchPendingReceivedLikesByUser: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/replies/liked/pending'
		}));
	}
});
