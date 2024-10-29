/******************************************************************************\
|                                                                              |
|                                     posts.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of posts.                              |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Post from '../../models/topics/post.js';
import TimestampedCollection from '../../collections/utilities/timestamped-collection.js';

export default TimestampedCollection.extend({

	//
	// attributes
	//

	model: Post,
	
	//
	// fetching methods
	//

	fetchByTopic: function(topic, options) {
		return this.fetch(_.extend(options, {
			url: (topic && !topic.isDefault()? topic.url() : config.servers.api + '/users/current') + '/posts' + (options && options.updates? '/updates' : ''),
			silent: true
		}));
	},

	fetchByUser: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/posts' + (options && options.updates? '/updates' : ''),
			silent: true
		}));
	},

	fetchPublic: function(options) {
		return this.fetch(_.extend(options, {
			url: Post.prototype.urlRoot + '/public',
			silent: true
		}));
	},

	//
	// updating methods - called to clean up soft deleted items
	//

	updateByTopic: function(topic, options) {
		return $.ajax(_.extend({
			url: (topic && !topic.isDefault? topic.url() : config.servers.api + '/users/current') + '/posts/update',
			type: 'PUT'
		}, options));
	},

	updateByUser: function(user, options) {
		return $.ajax(_.extend({
			url: user.url() + '/posts/update',
			type: 'PUT'
		}, options));
	}
});
