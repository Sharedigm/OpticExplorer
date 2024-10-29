/******************************************************************************\
|                                                                              |
|                               share-menu-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying share dropdown menus.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<% if (config.apps.connection_manager && !config.apps.connection_manager.hidden) { %>
		<li role="presentation">
			<a class="share-by-invitation"><i class="fa fa-user-friends"></i>By Invitation</a>
		</li>

		<li role="separator" class="divider"></li>
		<% } %>

		<li role="presentation">
			<a class="share-by-topic"><i class="fa fa-newspaper"></i>By Discussion Topic</a>
		</li>

		<li role="presentation">
			<a class="share-by-message"><i class="fa fa-comments"></i>By Chat Messsage</a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="share-by-link"><i class="fa fa-link"></i>By Link</a>
		</li>

		<li role="presentation">
			<a class="share-by-email"><i class="fa fa-envelope"></i>By Email</a>
		</li>
	`),

	events: {
		'click .share-by-invitation': 'onClickShareByInvitation',
		'click .share-by-topic': 'onClickShareByTopic',
		'click .share-by-message': 'onClickShareByMessage',
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail'
	},

	//
	// querying methods
	//

	visible: function() {
		let hasTopics = config.apps.topic_browser.hidden != true;
		let hasChats = config.apps.chat_browser.hidden != true;

		return {
			'share-by-invitation': true,
			'share-by-topic': hasTopics,
			'share-by-message': hasChats,
			'share-by-link': true,
			'share-by-email': true
		};
	},

	enabled: function() {
		let hasShareable = this.parent.app.hasShareable();

		return {
			'share-by-invitation': hasShareable,
			'share-by-topic': hasShareable,
			'share-by-message': hasShareable,
			'share-by-link': hasShareable,
			'share-by-email': hasShareable
		};
	}
});