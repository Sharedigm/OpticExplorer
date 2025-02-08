/******************************************************************************\
|                                                                              |
|                                   groups.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of groups.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Group from '../../models/connections/group.js';
import Members from '../../collections/connections/members.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Group,

	//
	// sorting methods
	//

	comparator : function(model) {
		return model.get('name');
	},
	
	//
	// querying methods
	//

	hasItemNamed: function(name) {
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (name == model.get('name')) {
				return true;
			}
		}
		return false;
	},

	//
	// getting methods
	//

	getUniqueName: function(name) {

		// find unused name
		//
		if (this.hasItemNamed(name)) {

			// add index
			//
			let index = 2;
			while (this.hasItemNamed(name + index)) {
				index++;
			}
			name += index;
		}

		return name;
	},

	//
	// setting methods
	//

	createGroup: function(name, options) {

		// create and save new group
		//
		new Group().save({
			name: this.getUniqueName(name),
			members: new Members()
		}, {

			// callbacks
			//
			success: (model) => {

				// set members to belong to group
				//
				model.get('members').group = model;

				// add group to collection
				//
				this.add(model);

				// perform callback
				//
				if (options && options.success) {
					options.success(model);
				}
			},

			error: () => {

				// perform callback
				//
				if (options && options.error) {
					options.error();
				}
			}
		});
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/groups',

			// callbacks
			//
			error: () => {

				// show error message
				//
				application.error({
					message: "Could not find user's groups."
				});
			}
		}, options));
	}
});
