/******************************************************************************\
|                                                                              |
|                                 user-jobs.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of user jobs.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserJob from '../../../models/users/profile/user-job.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: UserJob,

	//
	// sorting methods
	//

	comparator: function(model) {
		let date = model.get('from_date') || model.get('to_date');
		return date? -date.getTime() : undefined;
	},

	//
	// getting methods
	//

	getCurrent: function() {
		let job = this.at(0);
		if (job && !job.has('to_date')) {
			return job;
		}
	},

	//
	// fetching methods
	//

	fetchByUser: function(user, options) {
		return this.fetch(_.extend({
			url: user.url() + '/jobs'
		}, options));
	}
});
