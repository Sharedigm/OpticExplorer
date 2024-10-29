/******************************************************************************\
|                                                                              |
|                                 notifications.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of notifications.                      |
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
import LikeNotification from '../../models/notifications/like-notification.js';
import CommentNotification from '../../models/notifications/comment-notification.js';
import ReplyNotification from '../../models/notifications/reply-notification.js';
import ShareRequestNotification from '../../models/notifications/share-request-notification.js';
import TopicInvitationNotification from '../../models/notifications/topic-invitation-notification.js';
import ChatInvitationNotification from '../../models/notifications/chat-invitation-notification.js';
import GestureNotification from '../../models/notifications/gesture-notification.js';
import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Notification,

	//
	// ajax attributes
	//

	url: Notification.prototype.urlRoot,

	//
	// sorting methods
	//

	comparator: function(a, b) {
		return a.get('created_at') < b.get('created_at');
	},

	//
	// parsing (Backbone) methods
	//

	parse: function(response) {
		let notifications = [];
		for (let i = 0; i < response.length; i++) {
			let notification = response[i];

			// parse notification subclasses
			//
			if (notification.like) {
				notifications.push(new LikeNotification(notification, {
					parse: true
				}));
			} else if (notification.comment) {
				notifications.push(new CommentNotification(notification, {
					parse: true
				}));
			} else if (notification.reply) {
				notifications.push(new ReplyNotification(notification, {
					parse: true
				}));
			} else if (notification.share_request) {
				notifications.push(new ShareRequestNotification(notification, {
					parse: true
				}));
			} else if (notification.topic_invitation) {
				notifications.push(new TopicInvitationNotification(notification, {
					parse: true
				}));
			} else if (notification.chat_invitation) {
				notifications.push(new ChatInvitationNotification(notification, {
					parse: true
				}));
			} else if (notification.gesture) {
				notifications.push(new GestureNotification(notification, {
					parse: true
				}));
			}
		}

		return notifications;
	}
});
