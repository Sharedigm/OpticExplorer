/******************************************************************************\
|                                                                              |
|                              post-attachment.js                              |
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
import Post from '../../models/topics/post.js';
import QueryString from '../../utilities/web/query-string.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		user: undefined,
		message: undefined,
		public: true,
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/posts/attachments',

	//
	// getting methods
	//

	getData: function(options) {
		return _.extend({
			'path': this.get('filename'),
			'post_attachment_id': this.get('id')
		}, options);
	},

	getThumbnailUrl: function(options) {
		return config.servers.api + '/file/thumb?' + QueryString.encode(this.getData(options));
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
		if (data.post) {
			data.post = new Post(data.post, {
				parse: true
			});
		}

		return data;
	}
});