/******************************************************************************\
|                                                                              |
|                                user-events.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user (calendar) events.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserEvent from '../../models/events/user-event.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserEvent,

	//
	// sorting methods
	//

	comparator : function(model) {
		return model.get('event_date');
	},

	//
	// fetching methods
	//

	fetchByCurrentUser: function(options) {
		return this.fetch(_.extend({
			url: config.servers.api + '/events',

			// callbacks
			//
			error: () => {

				// show error message
				//
				application.error({
					message: "Could not find user's events."
				});
			}
		}, options));
	}
});
