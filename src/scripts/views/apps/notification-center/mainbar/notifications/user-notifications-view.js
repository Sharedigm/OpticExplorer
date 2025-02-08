/******************************************************************************\
|                                                                              |
|                         user-notifications-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a list of a user's notifications.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Notifications from '../../../../../collections/notifications/notifications.js';
import BaseView from '../../../../../views/base-view.js';
import NotificationsListView from '../../../../../views/apps/notification-center/mainbar/notifications/lists/notifications-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: template(`
		<h1 class="mobile-only"><i class="fa fa-newspaper"></i>My Notifications</h1>
		
		<div class="notifications panel"></div>
	`),

	regions: {
		notifications: '.notifications'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// fetch notifications
		//
		new Notifications().fetch({

			// callbacks
			//
			success: (collection) => {

				// show list view
				//
				this.showNotificationsList(collection);
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not get notifications.",
					response: response
				});
			}
		});
	},

	showNotificationsList: function(collection) {
		this.showChildView('notifications', new NotificationsListView({
			collection: collection,
			multicolumn: true
		}));
	}
});