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
			<a class="share-by-link"><i class="fa fa-link"></i>By Link</a>
		</li>
	`),
	
	events: {

		// share with connections
		//
		'click .share-by-topic': 'onClickShareByTopic',
		'click .share-by-message': 'onClickShareByMessage',

		// share with anyone
		//
		'click .share-by-link': 'onClickShareByLink',
		'click .share-by-email': 'onClickShareByEmail',

		// share with everyone
		//
		'click .share-by-public-topic': 'onClickShareByPublicTopic'
	},

	//
	// querying methods
	//

	enabled: function() {
		return application.isSignedIn();
	},

	//
	// mouse event handling methods
	//

	onClickShareByTopic: function() {
		this.parent.app.shareByTopic({
			privacy: 'connections'
		});
	},

	onClickShareByMessage: function() {
		this.parent.app.shareByMessage();
	},

	onClickShareByLink: function() {
		this.parent.app.shareByLink();
	},

	onClickShareByEmail: function() {
		this.parent.app.shareByEmail();
	},

	onClickShareByPublicTopic: function() {
		this.parent.app.shareByTopic({
			privacy: 'public'
		});
	}
});