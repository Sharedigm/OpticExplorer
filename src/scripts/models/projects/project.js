/******************************************************************************\
|                                                                              |
|                                  project.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a task tracking project.                      |
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
import ImageFile from '../../models/storage/media/image-file.js';
import Connection from '../../models/connections/connection.js';
import Connections from '../../collections/connections/connections.js';
import DateUtils from '../../utilities/time/date-utils.js';
import QueryString from '../../utilities/web/query-string.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		name: undefined,
		description: undefined,
		icon_path: undefined,
		keywords: undefined,
		public: false,
		private: false
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/projects',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return this.has('user')? this.get('user').is(user) : false;
	},

	isDefault: function() {
		return this.get('id') == 0;
	},

	isPublic: function() {
		return this.get('public') == true;
	},

	isPrivate: function() {
		return this.get('private') == true;
	},

	hasOwner: function() {
		return this.has('user');
	},

	hasThumbnail: function() {
		return this.has('icon_path') && this.get('icon_path').length != 0;
	},

	hasAttribute: function(attributeName) {
		switch (attributeName) {
			case 'create_date':
				return this.has('created_at');
			case 'modify_date':
				return this.has('updated_at');
			default:
				return this.has(attributeName);
		}
	},

	//
	// getting methods
	//

	getProjectThumbnailUrl: function(options) {
		let url = this.url() + '/thumb';

		// add options
		//
		if (options) {
			url += '?' + QueryString.encode(options);
		}

		return url;
	},

	getThumbnailUrl: function(options) {

		// check if project is owned by current user
		//
		if (this.isOwnedBy(application.session.user)) {

			// get image file thumbnail url
			//
			return new ImageFile({
				path: this.get('icon_path')
			}).getThumbnailUrl(options);

		// get project thumbnail url
		//
		} else {
			return this.getProjectThumbnailUrl(options);
		}
	},

	getIcon: function(options) {
		if (this.hasThumbnail()) {
			return '<div class="thumbnail" style="background-image:url(' + this.getThumbnailUrl(options) + ')"></div>';
		} else {
			return '<img class="thumbnail" src="images/icons/flat/clipboard-full.svg" />';
		}
	},

	getName: function() {
		return this.get('name');
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
		}		
	},

	//
	// attributes getting methods
	//

	getAttribute: function(attributeName, preferences) {	
		switch (attributeName) {
			case 'tasks':
				return 'task'.toPlural(this.get('num_tasks'));
			case 'members':
				return 'member'.toPlural(this.get('num_members'));
			case 'create_date':
				return this.getDateString('created_at', preferences? preferences.get('date_format') : undefined);
			case 'modify_date':
				return this.getDateString('updated_at', preferences? preferences.get('date_format') : undefined);
			default:
				return this.get(attributeName);
		}
	},

	getSortableAttribute: function(attributeName) {
		switch (attributeName) {
			case 'tasks':
				return this.get('num_tasks');
			case 'members':
				return this.get('num_members');
			case 'create_date':
				return this.get('created_at');
			case 'modify_date':
				return this.get('updated_at');
			default:
				return this.get(attributeName);
		}
	},

	//
	// ajax methods
	//

	fetchMembers: function(options) {
		return $.ajax(_.extend({}, options, {
			url: this.url() + '/users/',
			type: 'GET',

			// callbacks
			//
			success: (data) => {
				options.success(new Connections(data, {
					parse: true
				}));
			}
		}));
	},

	addMember: function(member, options) {
		return $.ajax(_.extend({}, options, {
			url: this.url() + '/users/' + member.get('id') + '/add',
			type: 'PUT'
		}));
	},

	removeMember: function(member, options) {
		return $.ajax(_.extend({}, options, {
			url: this.url() + '/users/' + member.get('id') + '/remove',
			type: 'PUT'
		}));
	},

	inviteMembers: function(members, options) {
		return $.ajax(_.extend({}, options, {
			url: this.url() + '/users/' + new Connections(members).getIds().join('+') + '/invite',
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
			data.user = new Connection(data.user, {
				parse: true
			});
		}

		return data;
	}
});