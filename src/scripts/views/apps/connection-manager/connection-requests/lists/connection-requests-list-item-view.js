/******************************************************************************\
|                                                                              |
|                     connection-requests-list-item-view.js                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for showing a single connection request list item.     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import NotificationsListItemView from '../../../../../views/apps/notification-center/mainbar/notifications/lists/notifications-list-item-view.js';
import Expandable from '../../../../../views/behaviors/expanders/expandable.js';

export default NotificationsListItemView.extend(_.extend({}, Expandable, {

	//
	// attributes
	//

	template: template(`
		<form class="form-horizontal">
		
			<div class="tile">
				<a class="user">
					<% if (thumbnail_url) { %>
					<div class="thumbnail" style="background-image:url(<%= thumbnail_url %>); background-size:<%= background_size %>" >
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
						<button type="button" class="accept success btn btn-sm" data-toggle="tooltip" title="Accept" data-placement="bottom">
							<i class="fa fa-plus"></i>
						</button>
						<button type="button" class="decline warning btn btn-sm" data-toggle="tooltip" title="Decline" data-placement="bottom">
							<i class="fa fa-minus"></i>
						</button>
					</div>
		
					<div class="title">
						<a class="user"><%= name %></a>
					</div>
				</div>
		
				<div class="fineprint">
					<i class="fa fa-user-friends" style="margin-right:5px"></i>
					Invited you to connect.
					<br />
		
					<a class="when">
						<i class="fa fa-calendar-alt" data-toggle="tooltip" title="<%= created_at.format('fullDate') %>"></i>
						<span class="elapsed-time"><%= when %></span>
					</a>
		
					<div class="expander">
						<button type="button" class="collapse btn-sm">
							<i class="fa fa-caret-up"></i>
						</button>
						<button type="button" class="expand btn-sm">
							<i class="fa fa-caret-down"></i>	
						</button>
					</div>
				</div>
			</div>
		
			<div class="hideable">
				<div class="form-groups">
		
					<% if (message) { %>
					<div class="form-group">
						<label class="form-label"><i class="fa fa-comment"></i>Note</label>
						<p class="form-control-static"><%= message %></p>
					</div>
					<% } %>
		
					<div class="form-group">
						<label class="form-label"><i class="fa fa-calendar-alt"></i>Date</label>
						<p class="form-control-static"><%= created_at.format('fullDate') %></p>
					</div>
				</div>
			</div>
		</form>
	`),

	events: {
		'click .user': 'onClickUser',
		'click .when': 'onClickWhen',
		'click .expander': 'onClickExpander',
		'click .accept': 'onClickAccept',
		'click .decline': 'onClickDecline'
	},

	//
	// getting methods
	//

	getThumbnailUrl: function() {
		return this.get('user').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// accepting methods
	//

	acceptRequest: function() {
		this.model.accept({

			// callbacks
			//
			success: () => {

				// remove item from pending list
				//
				this.model.collection.remove(this.model);

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-user-friends"></i>',
					title: 'Users Connected',
					message: "You and " + this.model.get('user').get('full_name') + " are now connected."
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Can not accept connection request.",
					response: response
				});
			}
		});
	},

	declineRequest: function() {
		this.model.decline({

			// callbacks
			//
			success: () => {

				// remove item from pending list
				//
				this.model.collection.remove(this.model);

				// show notification
				//
				application.notify({
					icon: '<i class="fa fa-user-friends"></i>',
					title: 'Connection Declined',
					message: "You declined " + this.model.get('user').get('full_name') + "'s connection request."
				});
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Can not decline connection request.",
					response: response
				});
			}
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.get('user').get('short_name'),
			href: application.getUrl() + '#users/' + this.get('user').get('id'),
			thumbnail_url: this.getThumbnailUrl(),
			background_size: this.thumbnailSize + 'px',
			when: this.model.when()
		};
	},

	onRender: function() {

		// collapse / expand
		//
		if (this.options.collapsed) {
			this.collapse();
		}
	},

	onAttach: function() {

		// add tooltip triggers
		//
		this.addTooltips();		
	},

	//
	// mouse event handling methods
	//

	onClickUser: function() {

		// show user's profile info
		//
		application.showUser(this.get('user'));
	},

	onClickExpander: function() {
		this.toggleCollapse();
	},
	
	onClickAccept: function() {
		this.acceptRequest();
	},

	onClickDecline: function() {
		this.declineRequest();
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		$('.tooltip').remove();
	}
}));