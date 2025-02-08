/******************************************************************************\
|                                                                              |
|                                   group.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a group of connections.                       |
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
import Member from '../../models/connections/member.js';
import Members from '../../collections/connections/members.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		name: undefined,
		icon_path: undefined,
		user_id: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/groups',

	//
	// querying methods
	//

	isOwnedBy: function(user) {
		return this.has('user')? this.get('user').is(user) : false;
	},

	hasOwner: function() {
		return this.has('user');
	},

	hasThumbnail: function() {
		return this.has('icon_path') && this.get('icon_path').length != 0;
	},

	//
	// getting methods
	//

	getName: function() {
		return this.get('name');
	},

	getThumbnailUrl: function(options) {

		// get image file thumbnail url
		//
		return new ImageFile({
			path: this.get('icon_path')
		}).getThumbnailUrl(options);
	},

	getIcon: function(options) {
		if (this.hasThumbnail()) {
			return '<div class="thumbnail" style="background-image:url(' + this.getThumbnailUrl(options) + ')"></div>';
		} else {
			return '<i class="fa fa-users"></i>';
		}
	},

	//
	// fetching methods
	//

	add: function(users, options) {
		let saves = 0, successes = 0, errors = 0;

		function addMember(member, group) {
			saves++;
			member.addTo(group, {

				// callbacks
				//
				success: (model) => {
					successes++;

					// report success when completed
					//
					if (successes === users.length) {
						if (options && options.success) {
							options.success(model);
						}
					}
				},

				error: () => {
					errors++;

					// report first error
					//
					if (errors === 1) {
						if (options && options.error) {
							options.error();
						}
					}
				}
			});
		}

		// save members individually
		//
		for (let i = 0; i < users.length; i++) {
			addMember(new Member(users[i].attributes), this);
		}

		// check for no changes
		//
		if (saves === 0) {

			// report success when completed
			//
			if (options && options.success) {
				options.success();
			}
		}
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
		if (data.members) {
			data.members = new Members(data.members, {
				parse: true
			});
			data.members.group = this;
		}

		return data;
	}
}, {

	//
	// static attributes
	//
	
	defaultName: 'Untitled'
});