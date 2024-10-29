/******************************************************************************\
|                                                                              |
|                                  projects.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of task tracking projects.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Project from '../../models/projects/project.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Project,
	url: config.servers.api + '/users/current/projects',

	//
	// getting methods
	//

	getById: function(id) {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('id') == id) {
				return this.at(i);
			}
		}
	},

	getByName: function(name) {
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('name') == name) {
				return this.at(i);
			}
		}
	},

	getByProject: function(project) {
		let id = project.get('project_id');
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).get('id') == id) {
				return this.at(i);
			}
		}
	},

	//
	// fetching methods
	//

	fetchPublic: function(options) {
		return this.fetch(_.extend(options, {
			url: Project.prototype.urlRoot + '/public',
			parse: true
		}));
	},

	fetchCurrent: function(options) {
		return this.fetch(_.extend(options, {
			url: this.url,
			parse: true
		}));
	},

	fetchOwned: function(options) {
		return this.fetch(_.extend(options, {
			url: this.url + '/owned',
			parse: true
		}));
	},

	fetchSubscribed: function(options) {
		return this.fetch(_.extend(options, {
			url: this.url + '/subscribed',
			parse: true
		}));	
	},

	fetchUnsubscribed: function(options) {
		return this.fetch(_.extend(options, {
			url: this.url + '/unsubscribed',
			parse: true
		}));	
	},

	fetchPublicUnsubscribed: function(options) {
		return this.fetch(_.extend(options, {
			url: this.url + '/unsubscribed/public',
			parse: true
		}));	
	},

	fetchRecentUnsubscribed: function(options) {
		return this.fetch(_.extend(options, {
			url: this.url + '/unsubscribed',
			data: {
				sort: 'created_at',
				order: 'desc'
			},
			parse: true
		}));	
	},

	//
	// sorting methods
	//

	comparator: function(model) {
		if (!model.isDefault()) {
			return model.get('name');
		} else {
			return '';
		}
	}
});
