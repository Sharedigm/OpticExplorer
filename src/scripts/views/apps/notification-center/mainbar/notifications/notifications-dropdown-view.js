/******************************************************************************\
|                                                                              |
|                        notifications-dropdown-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a dropdown list of notifications.       |
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
import UserNotificationsView from '../../../../../views/apps/notification-center/mainbar/notifications/user-notifications-view.js';
import NotificationsListView from '../../../../../views/apps/notification-center/mainbar/notifications/lists/notifications-list-view.js';
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import '../../../../../../vendor/bootstrap/js/dropdown.js';

export default UserNotificationsView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	tagName: 'li',
	className: 'dropdown',

	template: template(`
		<a class="dropdown-toggle" data-toggle="dropdown">
			<i class="fa fa-caret-down"></i>
			<i class="fa fa-exclamation-triangle"></i>
		</a>
		
		<div class="notifications dropdown-menu"></div>
	`),

	events: {
		'mouseover .dropdown-toggle': 'onMouseOverDropdownToggle'
	},

	// update every minute
	//
	updateInterval: 1000 * 60,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new Notifications();

		// listen to collection for changes
		//
		this.listenTo(this.collection, 'add, remove', this.onChange);
	},

	//
	// getting methods
	//

	getDesktopHeight: function() {
		return this.parent.parent.el.offsetHeight - 100;
	},

	//
	// setting methods
	//

	setBadgeCount: function(count) {

		// update count bubble
		//
		this.$el.find('.badge').text(count);

		// show  hide dropdown
		//
		if (count > 0) {
			this.$el.show();
		} else {
			this.$el.hide();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// initially hide dropdown
		//
		this.$el.hide();

		// show child views
		//
		this.collection.fetch({

			// callbacks
			//
			success: (collection) => {

				// show / hide dropdown
				//
				if (this.collection.length > 0) {
					this.$el.show();
				} else {
					this.$el.hide();
				}

				// show notifications
				//
				this.showNotifications(collection);

				// add tooltip triggers
				//
				this.addTooltips({
					container: 'body'
				});	

				// save date of most recent item
				//
				if (collection.length > 0) {
					let lastItem = collection.at(0);
					this.lastDate = lastItem.get('created_at');
				}

				// schedule next update
				//
				this.setTimeout(() => {
					this.updateNotifications();
				}, this.updateInterval);
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

		// hide menus on leave
		//
		this.$el.mouseleave(() => {
			this.$el.removeClass('open');
		});
	},

	updateNotifications: function() {

		// fetch notifications since last
		//
		new Notifications().fetch({
			data: {
				after: this.lastDate? this.lastDate.format('yyyy-mm-dd HH:MM:ss', false) : undefined
			},

			// callbacks
			//
			success: (collection) => {
				if (collection.length > 0) {

					// add new notifications to collection
					//
					this.collection.add(collection.models, {
						at: 0
					});

					// save date of most recent item
					//
					if (collection.length > 0) {
						let lastItem = collection.at(0);
						this.lastDate = lastItem.get('created_at');
					}

					// update count bubble
					//
					this.onChange();

					// play notify sound
					//
					application.play('notify');
				}

				// schedule next update
				//
				this.setTimeout(() => {
					this.updateNotifications();
				}, this.updateInterval);
			}
		});
	},

	showNotifications: function(collection) {

		// show list
		//
		this.showNotificationsList(collection);

		// unhide menus on hover
		//
		this.$el.find('.dropdown-toggle').hover((event) => {
			$(event.target).closest('.dropdown').trigger('open');
		});

		// set menu class on open
		//
		this.$el.on('open', (event) => {
			$(event.target).addClass('open');
		});

		// show number of notifications
		//
		this.addBadge(this.$el.find('.dropdown-toggle > i:last-child'), this.collection.length);

		// set color of header nav text
		//
		if (config.branding.header.color && config.branding.header.color != '') {
			this.$el.find('> a').css('color', config.branding.header.color);
		}
	},

	showNotificationsList: function(collection) {
		this.showChildView('notifications', new NotificationsListView({
			collection: collection
		}));
	},

	addBadge: function(element, number) {
		if (number > 0) {
			element.after('<span class="badge">' + number + '</span>');
		} else {
			element.after('<span class="badge badge-important">' + number + '</span>');
		}
	},

	//
	// event handling methods
	//

	onOpen: function() {

		// set max menu height
		//
		this.$el.find('.dropdown-menu').css('max-height', this.getDesktopHeight());
	},

	onChange: function() {

		// update count bubble
		//
		this.setBadgeCount(this.collection.length);
	},

	//
	// mouse event handling methods
	//

	onMouseOverDropdownToggle: function() {
		this.getChildView('notifications').update();
		this.onOpen();
	}
}));
