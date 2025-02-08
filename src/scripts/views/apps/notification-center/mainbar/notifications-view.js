/******************************************************************************\
|                                                                              |
|                            notifications-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for viewing notifications.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import NotificationsListView from '../../../../views/apps/notification-center/mainbar/notifications/lists/notifications-list-view.js';
import ConnectionRequestsListView from '../../../../views/apps/connection-manager/connection-requests/lists/connection-requests-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'contents',

	template: template(`
		<div class="content">
			<ul class="nav nav-tabs auto-width" role="tablist">
				<li role="presentation" class="notifications-tab active">
					<a role="tab" data-toggle="tab" href=".notifications-panel">
						<i class="fa fa-exclamation-triangle"></i>
						<label>Notifications</label>
					</a>
				</li>
		
				<li role="presentation" class="connection-requests-tab">
					<a role="tab" data-toggle="tab" href=".connection-requests-panel">
						<i class="fa fa-user-friends"></i>
						<label>Connections</label>
					</a>
				</li>
			</ul>
		
			<div class="tab-content">
				<div role="tabpanel" class="notifications-panel tab-pane active">
					<div class="notifications" style="margin:-5px">
						<i class="fa fa-3x centered fa-spinner" style="margin-left:-10px; margin-top:-10px"></i>
					</div>
				</div>
		
				<div role="tabpanel" class="connection-requests-panel tab-pane">
					<div class="connection-requests" style="margin:-5px"></div>
				</div>
			</div>
		</div>
	`),

	regions: {
		notifications: '.notifications',
		connection_requests: '.connection-requests'		
	},

	//
	// rendering methods
	//

	onRender: function() {
		this.showNotifications();
		this.showConnectionRequests();
	},

	showNotifications: function() {
		this.showChildView('notifications', new NotificationsListView({
			collection: this.collection
		}));		
	},

	showConnectionRequests: function() {
		this.showChildView('connection_requests', new ConnectionRequestsListView({
			collection: this.options.connection_requests
		}));	
	}
});