/******************************************************************************\
|                                                                              |
|                             like-notification.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a notification of a new like.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Notification from '../../models/notifications/notification.js';
import Like from '../../models/comments/like.js';

export default Notification.extend({

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {

		// call superclass method
		//
		let data = Notification.prototype.parse.call(this, response);

		// parse attributes
		//
		if (data.like) {
			data.like = new Like(data.like, {
				parse: true
			});
		}

		return data;
	}
});
