/******************************************************************************\
|                                                                              |
|                        share-request-notification.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a notification of a new share reqeust.        |
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
import ShareRequest from '../../models/storage/sharing/share-request.js';

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
		if (data.share_request) {
			data.share_request = new ShareRequest(data.share_request, {
				parse: true
			});
		}

		return data;
	}
});
