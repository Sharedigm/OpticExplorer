/******************************************************************************\
|                                                                              |
|                        topic-invitation-notification.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a model of a notification of a post topic                |
|        invitation.                                                           |
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
import TopicInvitation from '../../models/topics/sharing/topic-invitation.js';

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
		if (data.topic_invitation) {
			data.topic_invitation = new TopicInvitation(data.topic_invitation, {
				parse: true
			});
		}

		return data;
	}
});
