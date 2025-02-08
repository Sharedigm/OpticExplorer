/******************************************************************************\
|                                                                              |
|                                    member.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a group member.                               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connection from '../../models/connections/connection.js';

export default Connection.extend({

	//
	// fetching methods
	//
	
	addTo: function(group, options) {

		// add member to group
		//
		return $.ajax(_.extend({}, options, {
			url: group.url() + '/members/' + this.id,
			type: 'POST',

			// callbacks
			//
			success: () => {
				group.get('members').add(this);

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		}));
	},

	destroy: function(options) {

		// remove member from group
		//
		return $.ajax(_.extend({}, options, {
			url: this.collection.group.url() + '/members/' + this.id,
			type: 'DELETE',

			// callbacks
			//
			success: () => {

				// remove member from its group
				//
				this.collection.remove(this);

				// perform callback
				//
				if (options && options.success) {
					options.success(this);
				}
			}
		}));
	}
});