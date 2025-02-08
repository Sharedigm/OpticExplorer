/******************************************************************************\
|                                                                              |
|                          notifications-list-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of notifications.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ShareRequestNotification from '../../../../../../models/notifications/share-request-notification.js';
import LikeNotification from '../../../../../../models/notifications/like-notification.js';
import CommentNotification from '../../../../../../models/notifications/comment-notification.js';
import ReplyNotification from '../../../../../../models/notifications/reply-notification.js';
import TopicInvitationNotification from '../../../../../../models/notifications/topic-invitation-notification.js';
import ChatInvitationNotification from '../../../../../../models/notifications/chat-invitation-notification.js';
import GestureNotification from '../../../../../../models/notifications/gesture-notification.js';
import CollectionView from '../../../../../../views/collections/collection-view.js';
import ShareRequestNotificationView from '../../../../../../views/apps/notification-center/mainbar/notifications/share-request-notification-view.js';
import LikeNotificationView from '../../../../../../views/apps/notification-center/mainbar/notifications/like-notification-view.js';
import CommentNotificationView from '../../../../../../views/apps/notification-center/mainbar/notifications/comment-notification-view.js';
import ReplyNotificationView from '../../../../../../views/apps/notification-center/mainbar/notifications/reply-notification-view.js';
import TopicInvitationNotificationView from '../../../../../../views/apps/notification-center/mainbar/notifications/topic-invitation-notification-view.js';
import ChatInvitationNotificationView from '../../../../../../views/apps/notification-center/mainbar/notifications/chat-invitation-notification-view.js';
import GestureNotificationView from '../../../../../../views/apps/notification-center/mainbar/notifications/gesture-notification-view.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'notifications panels',
	empty: "No notifications.",
	emptyClassName: 'empty panel',

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		CollectionView.prototype.initialize.call(this);

		// set optional parameter defaults
		//
		if (this.options.collapsed == undefined) {
			this.options.collapsed = true;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		if (this.options.multicolumn) {
			this.$el.addClass('multi-column');
		}
	},
	
	childView: function(item) {
		if (item instanceof ShareRequestNotification) {
			return ShareRequestNotificationView;
		} else if (item instanceof LikeNotification) {
			return LikeNotificationView;
		} else if (item instanceof CommentNotification) {
			return CommentNotificationView;
		} else if (item instanceof ReplyNotification) {
			return ReplyNotificationView;
		} else if (item instanceof TopicInvitationNotification) {
			return TopicInvitationNotificationView;
		} else if (item instanceof ChatInvitationNotification) {
			return ChatInvitationNotificationView;
		} else if (item instanceof GestureNotification) {
			return GestureNotificationView;
		}
	},

	childViewOptions: function() {
		return {
			collapsed: this.options.collapsed
		}; 
	},

	update: function() {
		for (let i = 0; i < this.children.length; i++) {
			let child = this.children.findByIndex(i);
			child.update();
		}
	}
});
