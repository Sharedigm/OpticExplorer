/******************************************************************************\
|                                                                              |
|                                 user-event.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a user (calendar) event.                      |
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
import DateUtils from '../../utilities/time/date-utils.js';

export default Timestamped.extend({

	//
	// attributes
	//

	defaults: {
		name: undefined,
		description: undefined,
		event_date: undefined
	},

	//
	// ajax attributes
	//

	urlRoot: config.servers.api + '/events',

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Timestamped.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.event_date) {
			data.event_date = DateUtils.localToUTCDate(this.toDate(data.event_date));
		}

		return data;
	}
});