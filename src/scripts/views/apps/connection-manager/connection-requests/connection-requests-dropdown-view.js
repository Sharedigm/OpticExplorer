/******************************************************************************\
|                                                                              |
|                     connection-requests-dropdown-view.js                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a dropdown list of connection requests.    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ConnectionRequests from '../../../../collections/connections/connection-requests.js';
import ConnectionRequestsView from '../../../../views/apps/connection-manager/connection-requests/connection-requests-view.js';
import ConnectionRequestsListView from '../../../../views/apps/connection-manager/connection-requests/lists/connection-requests-list-view.js';
import '../../../../../vendor/bootstrap/js/dropdown.js';

export default ConnectionRequestsView.extend({

	//
	// attributes
	//

	tagName: 'li',
	className: 'dropdown',

	template: template(`
		<a class="dropdown-toggle" data-toggle="dropdown">
			<i class="fa fa-caret-down"></i>
			<i class="fa fa-user-plus"></i>	
		</a>
			
		<div class="connection-requests dropdown-menu"></div>
	`),

	events: {
		'mouseover .dropdown-toggle': 'onMouseOverDropdownToggle'
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = new ConnectionRequests();

		// listen to collection
		//
		this.listenTo(this.collection, 'add, remove', this.onChange);
	},

	//
	// getting methods
	//

	getDesktopHeight: function() {
		return this.parent.parent.el.offsetHeight - 70;
	},

	//
	// fetching methods
	//

	fetchConnectionRequests: function(done) {
		this.collection.fetchPendingReceivedBy(this.model, {

			// callbacks
			//
			success: (collection) => {
				done(collection);
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

	//
	// setting methods
	//

	setBadgeCount: function(count) {

		// update count bubble
		//
		this.$el.find('.badge').text(count);

		// show / hide dropdown
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
		this.fetchConnectionRequests((collection) => {

			// show connection requests
			//
			this.showConnectionRequests(collection);

			// show / hide dropdown
			//
			if (collection.length > 0) {
				this.$el.show();
			} else {
				this.$el.hide();
			}
		});

		// hide menus on leave
		//
		this.$el.mouseleave(() => {
			this.$el.removeClass('open');
		});
	},

	showConnectionRequests: function(collection) {

		// show list
		//
		this.showConnectionRequestsList(collection);
		
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

		// show number of connection requests
		//
		this.addBadge(this.$el.find('.dropdown-toggle > i:last-child'), collection.length);

		// set color of header nav text
		//
		if (config.branding.header.color && config.branding.header.color != '') {
			this.$el.find('> a').css('color', config.branding.header.color);
		}
	},

	showConnectionRequestsList: function(collection) {
		this.showChildView('connection_requests', new ConnectionRequestsListView({
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
		this.onOpen();
	}
});