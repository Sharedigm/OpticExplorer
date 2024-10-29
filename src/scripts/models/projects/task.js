/******************************************************************************\
|                                                                              |
|                                    task.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a like of a project task.                     |
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
import DateUtils from '../../utilities/time/date-utils.js';
import TimeUtils from '../../utilities/time/time-utils.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		kind: undefined,
		title: undefined,
		description: undefined,
		keywords: undefined,
		priority: undefined,
		status: undefined,
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/tasks',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return this.has('user')? this.get('user').is(user) : false;
	},

	//
	// getting methods
	//

	getImage: function() {
		switch (this.get('kind')) {
			case 'bug':
				return 'images/icons/flat/bug.svg';
			case 'feature':
				return 'images/icons/flat/light-bulb.svg';
			default:
				return 'images/icons/flat/check.svg';
		}
	},

	getIcon: function() {
		switch (this.get('kind')) {
			case 'bug':
				return 'fa fa-bug';
			case 'feature':
				return 'fa fa-lightbulb';
			default:
				return 'fa fa-check';
		}
	},

	getPriority: function() {
		switch (this.get('priority')) {
			case 1:
				return 'lowest';
			case 2:
				return 'low';
			case 3:
				return 'medium';
			case 4:
				return 'high';
			case 5:
				return 'highest';
		}
	},

	getPriorityStars: function() {
		let html = '';
		let priority = this.get('priority');
		for (let i = 0; i < priority; i++) {
			html += '<i class="fa fa-star"></i>';
		}
		return html;
	},

	getDate: function(kind, dateFormat) {
		return this.get(kind).format(DateUtils.getDateFormat(dateFormat));
	},

	getDateString: function(kind, dateFormat) {
		switch (kind) {
			case 'created_at':
				return this.has(kind)? 'created ' + this.getDate(kind, dateFormat) : undefined;
			case 'updated_at':
				return this.has(kind)? 'updated ' + this.getDate(kind, dateFormat) : undefined;
			case 'due_date': {
				if (!this.has(kind)) {
					return undefined;
				}
				let dueDate = TimeUtils.LocalDateToUTCDate(this.get(kind));
				let dateString = dueDate.format('UTC:' + DateUtils.getDateFormat(dateFormat));
				return 'due ' + dateString;
			}
		}		
	},

	//
	// metadata querying methods
	//

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			case 'create_date':
				return this.has('created_at');
			case 'update_date':
				return this.has('updated_at');
			case 'due_date':
				return this.has('due_date');
			default:
				return this.has(attributeName);
		}
	},

	getAttribute: function(attributeName, preferences) {	
		switch (attributeName) {
			case 'priority':
				return this.getPriorityStars();
			case 'create_date':
				return this.getDateString('created_at', preferences? preferences.get('date_format') : undefined);
			case 'update_date':
				return this.getDateString('updated_at', preferences? preferences.get('date_format') : undefined);
			case 'due_date':
				return this.getDateString('due_date', preferences? preferences.get('date_format') : undefined);
			default:
				return this.get(attributeName);
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'create_date':
				return this.get('created_at');
			case 'update_date':
				return this.get('updated_at');
			case 'due_date':
				return this.get('due_date');
			default:
				return this.get(attributeName);
		}
	},

	//
	// setting methods
	//

	setProject: function(project, options) {
		this.save({
			project_id: project.get('id')
		}, {

			// callbacks
			//
			success: (model) => {

				// if task has been moved to a project other
				// than the current one, then remove from list.
				//
				if (project.get('id') != this.get('id')) {
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
		if (response.due_date) {
			json.due_date = this.toDate(response.due_date);
		}

		return json;
	},
});