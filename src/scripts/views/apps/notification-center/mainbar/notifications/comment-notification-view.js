/******************************************************************************\
|                                                                              |
|                         comment-notification-view.js                         |
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
					<i class="fa fa-comment"></i>
					<span>Commented on your <a href="<%= href %>" target="_blank">post</a>.</span>
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
		return '#posts/' + this.get('comment').get('post_id');
	},

	getThumbnailUrl: function() {
		return this.get('comment').get('user').getProfilePhotoUrl({
			min_size: Math.floor(this.thumbnailSize * (window.devicePixelRatio || 1))
		});
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			name: this.get('comment').get('user').get('short_name'),
			href: this.getUrl(),
			thumbnail_url: this.getThumbnailUrl(),
			thumbnail_size: this.thumbnailSize + 'px',
			message: this.get('comment').get('message'),
			when: this.model.when()
		};
	},

	showCommentPost: function(comment, post) {
		application.launch('post_viewer', {
			model: post,
			collapsed: false,
			selected: comment
		});
	},

	showPost: function() {
		let comment = this.get('comment');

		// show post
		//
		if (comment.has('post_id') && comment.get('post_id')) {
			new Post({
				id: comment.get('post_id')
			}).fetch({

				// callbacks
				//
				success: (post) => {

					// show comment's post
					//
					this.showCommentPost(comment, post);
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

		// show post that comment belongs to
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
			id: this.get('comment').get('user').get('id')
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
					message: "User not found.",
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