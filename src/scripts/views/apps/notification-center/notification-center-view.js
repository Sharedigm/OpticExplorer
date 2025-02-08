/******************************************************************************\
|                                                                              |
|                         notification-center-view.js                          |
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

import Notifications from '../../../collections/notifications/notifications.js';
import ConnectionRequests from '../../../collections/connections/connection-requests.js';
import AppView from '../../../views/apps/common/app-view.js';
import HeaderBarView from '../../../views/apps/notification-center/header-bar/header-bar-view.js';
import NotificationsView from '../../../views/apps/notification-center/mainbar/notifications-view.js';
import FooterBarView from '../../../views/apps/notification-center/footer-bar/footer-bar-view.js';
import NotificationsDropdownView from '../../../views/apps/notification-center/mainbar/notifications/notifications-dropdown-view.js';
import PreferencesFormView from '../../../views/apps/clock/forms/preferences/preferences-form-view.js'

export default AppView.extend({

	//
	// attributes
	//

	name: 'notification_center',
	
	regions: {
		header: {
			el: '.header-bar',
			replaceElement: true
		},
		contents: {
			el: '.contents',
			replaceElement: true
		},
		context: {
			el: '.context-menu',
			replaceElement: true
		},
		footer: {
			el: '.footer-bar',
			replaceElement: true
		}
	},

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		AppView.prototype.initialize.call(this);

		// set attributes
		//
		this.model = application.session.user;
		this.collection = new Notifications();
		this.connection_requests = new ConnectionRequests();

		// set static attributes
		//
		this.constructor.current = this;
	},

	//
	// getting methods
	//

	getStatusBarView: function() {
		return FooterBarView.prototype.getStatusBarView();
	},

	//
	// closing methods
	//

	close: function() {

		// close parent dialog
		//
		this.dialog.close();
	},

	load: function() {

		// fetch notifications
		//
		this.collection.fetch({

			// callbacks
			//
			success: () => {
				this.connection_requests.fetchPendingReceivedBy(this.model, {

					// callbacks
					//
					success: () => {
						this.onLoad();
					},

					error: (model, response) => {

						// show error message
						//
						application.error({
							message: "Could not get connection requests.",
							response: response
						});
					}
				});
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

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.load();
	},

	//
	// header bar rendering methods
	//

	getHeaderBarView: function() {
		return new HeaderBarView();
	},

	//
	// contents rendering methods
	//

	getContentsView: function() {
		return new NotificationsView({
			collection: this.collection,
			connection_requests: this.connection_requests
		});
	},

	//
	// footer bar rendering methods
	//

	getFooterBarView: function() {
		return new FooterBarView();
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// render contents
		//
		this.showHeaderBar();
		this.showContents();
		this.showFooterBar();

		// call superclass method
		//
		AppView.prototype.onLoad.call(this);
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {

		// clear static attributes
		//
		this.constructor.current = null;
	}
}, {

	//
	// static getting methods
	//

	getPreferencesFormView: function(options) {
		return new PreferencesFormView(options);
	},

	getNotificationsDropdownView: function(model) {
		return new NotificationsDropdownView({
			model: model
		});
	}
});