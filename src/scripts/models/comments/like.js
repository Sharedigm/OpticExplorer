/******************************************************************************\
|                                                                              |
|                                    like.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a like of an item.                            |
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
import Post from '../../models/topics/post.js';
import Comment from '../../models/comments/comment.js';
import Reply from '../../models/comments/reply.js';

export default Timestamped.extend({

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let json = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (json.user) {
			json.user = new User(json.user);
		}
		if (json.item) {
			switch (json.item_kind) {
				case 'post':
					json.item = new Post(json.item);
					break;
				case 'comment':
					json.item = new Comment(json.item);
					break;
				case 'reply':
					json.item = new Reply(json.item);
					break;
				default:
					json.item = new Timestamped(json.item);
					break;
			}
		}

		return json;
	},
});