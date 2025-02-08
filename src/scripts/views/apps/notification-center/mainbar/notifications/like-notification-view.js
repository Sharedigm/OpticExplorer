/******************************************************************************\
|                                                                              |
|                          like-notification-view.js                           |
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
import Post from '../../../../../models/topics/post.js';
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
					<i class="fa fa-thumbs-up"></i>
					<span>Liked your <a href="<%= href %>" class="item"><%= item_kind %></a>.</span>
					<br />
		
					<a class="when">
						<i class="fa fa-calendar-alt" data-toggle="tooltip" title="<%= created_at.format('fullDate') %>"></i>
						<span class="elapsed-time"><%= when %></span>
					</a>
				</div>
			</div>
		</form>
	`),

	events: {
		'click': 'onClick',
		'click .user': 'onClickUser',
		'click .when': 'onClickWhen',
		'click .expander': 'onClickExpander',
		'click .dismiss': 'onClickDismiss'
	},

	// notification attributes
	//
	clickable: true,

	//
	// getting methods
	//

	getUrl: function() {
		let item = this.get('like').get('item');
		if (item) {	
			return '#posts/' + ((item instanceof Post)? item.get('id') : item.get('post_id'));
		}
	},

	getThumbnailUrl: function() {
		return this.get('like').get('user').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.get('like').get('user').get('short_name'),
			href: this.getUrl(),
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			item_kind: this.get('like').get('item_kind'),
			when: this.model.when()
		};
	},

	showLikedPost: function(item, post) {
		application.launch('post_viewer', {
			model: post,
			collapsed: false,
			selected: item
		});
	},

	showPost: function() {
		let item = this.get('like').get('item');

		// show post
		//
		if (item && ((item instanceof Post) || (item.has('post_id')))) {
			new Post({
				id: (item instanceof Post)? item.get('id') : item.get('post_id')
			}).fetch({

				// callbacks
				//
				success: (post) => {

					// show liked post
					//
					this.showLikedPost(item, post);
				}
			});
		} else {

			// show alert message
			//
			application.alert({
				message: "Post not found."
			});
		}
	},

	//
	// mouse event handling methods
	//

	onClick: function(event) {

		// show post that like belongs to
		//
		this.showPost();

		// prevent default click handling
		//
		event.preventDefault();
	},

	onClickUser: function() {

		// find connection
		//
		new Connection({
			id: this.get('like').get('user').get('id')
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

	onClickDismiss: function() {
		this.dismiss();

		// done handling event
		//
		return false;
	}
});
