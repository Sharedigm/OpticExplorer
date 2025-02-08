/******************************************************************************\
|                                                                              |
|                         gesture-notification-view.js                         |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying a type of notification.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Connection from '../../../../../models/connections/connection.js';
import NotificationsListItemView from '../../../../../views/apps/notification-center/mainbar/notifications/lists/notifications-list-item-view.js';

export default NotificationsListItemView.extend({

	//
	// attributes
	//

	template: template(`
		<form class="form-horizontal">
		
			<div class="tile">
				<a class="user">
					<% if (thumbnail_url) { %>
					<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>)">
						<img style="display:none" src="<%= thumbnail_url %>" onerror="this.classList.add('lost')" />
						<i class="placeholder far fa-user"></i>
					</div>
					<% } else { %>
					<div class="thumbnail">
						<i class="fa fa-user"></i>
					</div>
					<% } %>
				</a>
			</div>
		
			<div class="info">
				<div class="heading">
					<div class="buttons">
						<button type="button" class="reply caution btn btn-sm" data-toggle="tooltip" title="Return <%= kind.toTitleCase() %>" data-placement="bottom">
							<i class="fa fa-reply"></i>
						</button>
						<button type="button" class="dismiss warning btn btn-sm" data-toggle="tooltip" title="Dismiss" data-placement="bottom">
							<i class="fa fa-xmark"></i>
						</button>
					</div>
		
					<div class="title">
						<a class="user">
							<%= name %>
						</a>
					</div>
				</div>
		
				<div class="fineprint">
					<%= icon %>
					<span>Sent you a <%= kind %>.</span>
					<br />
					<i class="fa fa-calendar-alt" data-toggle="tooltip" title="<%= created_at.format('fullDate') %>"></i>
					<span class="when"><%= when %></span>
				</div>
			</div>
		</form>
	`),

	events: {
		'click': 'onClick',
		'click .user': 'onClickUser',
		'click .expander': 'onClickExpander',
		'click .reply': 'onClickReply',
		'click .dismiss': 'onClickDismiss'
	},

	//
	// getting methods
	//

	getIcon: function() {
		switch (this.get('gesture').get('kind')) {
			case 'poke':
				return '<i class="fa fa-hand-right"></i>';
			case 'wink':
				return '<i class="fa fa-eye"></i>';
			case 'wave':
				return '<i class="fa fa-hand-paper"></i>';
			case 'peace-sign':
				return '<i class="fa fa-hand-peace"></i>';
			case 'live-long-and-prosper':
				return '<i class="fa fa-hand-spock"></i>';
			case 'hug':
				return '<i class="fa fa-user-circle"></i>';
			case 'kiss':
				return '<i class="fa fa-heart"></i>';
		}
	},

	getThumbnailUrl: function() {
		return this.get('gesture').get('sender').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			kind: this.get('gesture').get('kind'),
			icon: this.getIcon(),
			name: this.get('gesture').get('sender').get('short_name'),
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			when: this.model.when()
		};
	},

	update: function() {
		this.$el.find('.when').text(this.model.when());
	},

	//
	// mouse event handling methods
	//

	onClickUser: function() {

		// find connection
		//
		new Connection({
			id: this.get('gesture').get('sender').get('id')
		}).fetch({

			// callbacks
			//
			success: (model) => {

				// show connection's profile info
				//
				application.showUser(model);
			},

			error: (response) => {

				// show error message
				//
				application.error({
					message: "Connection not found.",
					response: response
				});
			}
		});

		// done handling event
		//
		return false;
	},

	onClickExpander: function() {
		this.toggleCollapse();

		// done handling event
		//
		return false;
	},

	onClickReply: function() {
		this.get('gesture').reply({

			// callbacks
			//
			success: (model) => {
				this.dismiss();

				// play gesture sound
				//
				model.play();

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-envelope"></i>',
					title: 'Gesture Sent',
					message: 'You just sent ' + model.get('recipient').get('short_name') + ' a ' + model.get('kind') + '.'
				});
			},

			error: () => {

				// show error message
				//
				application.error({
					message: 'Could not save gesture.'
				});
			}
		});
	},

	onClickDismiss: function() {
		this.dismiss();

		// play gesture sound
		//
		this.get('gesture').play();

		// done handling event
		//
		return false;
	}
});
