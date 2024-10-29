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
		
		<li role="presentation" style="display:none">
			<a class="share-by-email"><i class="fa fa-envelope"></i>By Email</a>
		</li>
	`),
	
	events: {

		// share with connections
		//
		'click .share-by-message': 'onClickShareByMessage',

		// share with anyone
		//
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail',

		// share with everyone
		//
		'click .share-by-topic': 'onClickShareByTopic'
	},

	//
	// mouse event handling methods
	//

	onClickShareByMessage: function() {
		this.parent.app.shareByMessage();
	},

	onClickShareByLink: function() {
		this.parent.app.shareByLink();
	},

	onClickShareByEmail: function() {
		this.parent.app.shareByEmail();
	},

	onClickShareByTopic: function() {
		this.parent.app.shareByTopic();
	}
});