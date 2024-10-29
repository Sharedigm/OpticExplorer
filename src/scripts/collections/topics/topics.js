/******************************************************************************\
|                                                                              |
|                                   topics.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of post topics.                        |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topic from '../../models/topics/topic.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Topic,

	//
	// getting methods
	//

	getByName: function(name) {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('name') == name) {
				return this.at(i);
			}
		}
	},

	getByPost: function(post) {
		let id = post? post.get('topic_id') : undefined;
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('id') == id) {
				return this.at(i);
			}
		}
	},

	//
	// fetching methods
	//

	fetch: function(options) {

		// fetch user topics
		//
		if (application.isSignedIn()) {
			return this.fetchCurrent(options);

		// fetch public topics
		//
		} else {
			return this.fetchPublic(options);
		}
	},

	fetchCurrent: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot,
			parse: true
		}));
	},

	fetchPublic: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot + '/public',
			parse: true
		}));
	},

	fetchOwned: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot + '/owned',
			parse: true
		}));
	},

	fetchSubscribed: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot + '/subscribed',
			parse: true
		}));	
	},

	fetchUnsubscribed: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot + '/unsubscribed',
			parse: true
		}));	
	},

	fetchPublicUnsubscribed: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot + '/unsubscribed',
			parse: true
		}));
	},

	fetchRecentUnsubscribed: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot + '/unsubscribed',
			data: {
				sort: 'created_at',
				order: 'desc'
			},
			parse: true
		}));	
	},

	fetchAll: function(options) {
		return BaseCollection.prototype.fetch.call(this, _.extend(options, {
			url: Topic.prototype.urlRoot + '/all',
			parse: true
		}));
	},

	//
	// sorting methods
	//

	comparator: function(model) {
		if (model.isDefault && !model.isDefault()) {
			return model.get('name');
		} else {
			return '';
		}
	}
});
