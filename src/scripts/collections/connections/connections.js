/******************************************************************************\
|                                                                              |
|                                connections.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of connections.                        |
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
import Users from '../../collections/users/users.js';

export default Users.extend({

	//
	// attributes
	//

	model: Connection,
	url: config.servers.api + '/connections/connected',

	//
	// getting methods
	//

	getNames: function() {
		let names = [];
		for (let i = 0; i < this.length; i++) {
			names.push(this.at(i).getName());
		}
		return names;
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/connections',

			// callbacks
			//
			error: () => {

				// show error message
				//
				application.error({
					message: "Could not find user's connections."
				});
			}
		}, options));
	},

	fetchMutual: function(user, connection, options) {
		return this.fetch(_.extend({
			url: user.url() + '/connections/' + connection.get('id'),

			// callbacks
			//
			error: () => {

				// show error message
				//
				application.error({
					message: "Could not find mutual connections."
				});
			}
		}, options));
	},

	findByName: function(user, name, options) {
		return this.fetch(_.extend(options, {
			url: user.url() + '/connections',
			data: {
				name: name
			},

			// callbacks
			//
			error: () => {

				// show error message
				//
				application.error({
					message: "Could not find user's connections by name."
				});
			}
		}));
	},

	//
	// ajax methods
	//

	disconnectFrom: function(user, options) {
		let successes = 0, errors = 0, count = this.length;

		function disconnect(connection) {
			user.disconnect(connection, {

				// callbacks
				//
				success: () => {
					successes++;

					// perform callback when complete
					//
					if (successes === count) {
						if (options && options.success) {
							options.success();
						}
					}
				},

				error: () => {
					errors++;

					// report first error
					//
					if (errors === 1 && options && options.error) {
						options.error();
					}
				}
			});
		}

		// disconnect connections individually
		//
		for (let i = 0; i < count; i++) {
			disconnect(this.pop());
		}

		// check for no changes
		//
		if (count === 0) {

			// report success when completed
			//
			if (options && options.success) {
				options.success();
			}
		}
	}
}, {
	
	//
	// static methods
	//

	getNames: function(connections) {
		let names = [];
		for (let i = 0; i < connections.length; i++) {
			names.push(connections[i].getName());
		}
		return names;
	},
});
