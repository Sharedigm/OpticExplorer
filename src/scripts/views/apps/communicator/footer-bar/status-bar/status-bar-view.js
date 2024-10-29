/******************************************************************************\
|                                                                              |
|                               status-bar-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of an application's status information.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Topic from '../../../../../models/topics/topic.js';
import Post from '../../../../../models/topics/post.js';
import Chat from '../../../../../models/chats/chat.js';
import BaseView from '../../../../../views/base-view.js';
import Browser from '../../../../../utilities/web/browser.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'status-bar',

	topicsTemplate: template(`
		<span class="info-bar">
			<i class="fa fa-newspaper"></i>
			<% if (num_selected > 0 && num_posts > 0) { %>
			<% if (is_mobile) { %>
			<%= num_selected %> selected
			<% } else { %>
			<%= num_selected %> of <%= num_posts %> posts selected
			<% } %>
			<% } else if (num_posts != undefined) { %>
			<%= num_posts %> posts
			<% } else { %>
			Loading...
			<% } %>
		</span>
	`),

	chatsTemplate: template(`
		<span class="info-bar">
			<i class="fa fa-comments"></i>
			<% if (num_selected > 0 && num_messages > 0) { %>
			<% if (is_mobile) { %>
			<%= num_selected %> selected
			<% } else { %>
			<%= num_selected %> of <%= num_messages %> messages selected
			<% } %>
			<% } else if (num_messages != undefined) { %>
			<%= num_messages %> messages
			<% } else { %>
			Loading...
			<% } %>
		</span>
	`),

	//
	// rendering methods
	//

	getTemplate: function() {
		let model = this.parent.app.getActiveModel();
		if (!model || model instanceof Topic) {
			return this.topicsTemplate;
		} else if (model instanceof Post) {
			return this.topicsTemplate;
		} else if (model instanceof Chat) {
			return this.chatsTemplate;
		}
	},

	topicsContext: function() {
		return {
			num_posts: this.parent.app.numPosts(),
			num_selected: this.parent.app.numSelected(),
			is_mobile: Browser.is_mobile
		};
	},

	chatsContext: function() {
		return {
			num_messages: this.parent.app.numMessages(),
			num_selected: this.parent.app.numSelected(),
			is_mobile: Browser.is_mobile
		};
	},

	templateContext: function() {
		let model = this.parent.app.getActiveModel();
		if (!model || model instanceof Topic) {
			return this.topicsContext();
		} else if (model instanceof Post) {
			return this.topicsContext();
		} else if (model instanceof Chat) {
			return this.chatsContext();
		}
	},

	update: function() {
		if (this.parent.app.hasActiveView()) {
			this.render();
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {
		this.update();
	},

	onChangeTab: function() {
		this.update();
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.update();
	},

	onDeselect: function() {
		this.update();
	}
});