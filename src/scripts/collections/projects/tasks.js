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

import Task from '../../models/projects/task.js';
import TimestampedCollection from '../../collections/utilities/timestamped-collection.js';

export default TimestampedCollection.extend({

	//
	// attributes
	//

	model: Task,
	
	//
	// fetching methods
	//

	fetchByProject: function(project, options) {
		return this.fetch(_.extend(options, {
			url: (project && !project.isDefault()? project.url() : config.servers.api + '/users/current') + '/tasks' + (options && options.updates? '/updates' : ''),
			silent: true
		}));
	},

	fetchByUser: function(user, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/tasks' + (options && options.updates? '/updates' : ''),
			silent: true
		}));
	},

	//
	// updating methods - called to clean up soft deleted items
	//

	updateByProject: function(project, options) {
		return $.ajax(_.extend({
			url: (project && !project.isDefault()? project.url() : config.servers.api + '/users/current') + '/tasks/update',
			type: 'PUT'
		}, options));
	},

	updateByUser: function(user, options) {
		return $.ajax(_.extend({
			url: user.url() + '/tasks/update',
			type: 'PUT'
		}, options));
	}
});
