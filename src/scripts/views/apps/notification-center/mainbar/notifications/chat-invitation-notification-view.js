/******************************************************************************\
|                                                                              |
|                     chat-invitation-notification-view.js                     |
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
import Chat from '../../../../../models/chats/chat.js';
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
						<button type="button" class="accept success btn btn-sm" data-toggle="tooltip" title="Accept" data-placement="bottom">
							<i class="fa fa-plus"></i>
						</button>
						<button type="button" class="decline warning btn btn-sm" data-toggle="tooltip" title="Decline" data-placement="bottom">
							<i class="fa fa-minus"></i>
						</button>
					</div>
		
					<div class="title">
						<a class="user">
							<%= name %>
						</a>
					</div>
				</div>
		
				<div class="fineprint">
					<i class="fa fa-comments"></i>
					<span>Invited you to join a chat. </span>
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
						<label class="form-label"><i class="fa fa-quote-left"></i>Note</label>
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

	getSender: function() {
		return this.get('chat_invitation').get('sender');
	},

	getThumbnailUrl: function() {
		return this.get('chat_invitation').get('sender').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// rendering methods
	//

	showChat: function(chat) {
		application.launch('chat_viewer', {
			model: chat
		});
	},

	//
	// accepting methods
	//

	accept: function() {

		// accept chat invitation
		//
		this.get('chat_invitation').accept({

			// callbacks
			//
			success: (data) => {

				// dismiss notification
				//
				this.dismiss();

				// show new chat
				//
				this.showChat(new Chat(data.chat, {
					parse: true
				}));
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not accept chat invitation.",
					response: response
				});
			}
		});
	},

	decline: function() {

		// decline chat invitation
		//
		this.get('chat_invitation').decline({

			// callbacks
			//
			success: () => {

				// dismiss notification
				//
				this.dismiss();
			},

			error: (model, response) => {

				// show error message
				//
				application.error({
					message: "Could not decline chat invitation.",
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
			name: this.get('chat_invitation').get('sender').get('short_name'),
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			message: this.get('chat_invitation').get('message'),
			when: this.model.when()
		};
	},

	//
	// mouse event handling methods
	//

	onClickUser: function() {

		// find connection
		//
		new Connection({
			id: this.model.get('chat_invitation').get('user').get('id')
		}).fetch({

			// callbacks
			//
			success: (model) => {

				// show user's profile info
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
	},

	onClickExpander: function() {
		this.toggleCollapse();
	},
	
	onClickAccept: function() {
		this.accept();
	},

	onClickDecline: function() {
		this.decline();
	}
});
