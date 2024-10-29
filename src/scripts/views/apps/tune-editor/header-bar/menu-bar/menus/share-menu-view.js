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

import ShareMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/share-menu-view.js';

export default ShareMenuView.extend({

	//
	// querying methods
	//

	enabled: function() {
		return application.session.user && this.parent.app.model != undefined && 
			this.parent.app.model.isSaved() && !this.parent.app.model.hasBeenShared();
	},

	//
	// mouse event handling methods
	//

	onClickShareByInvitation: function() {
		this.parent.app.shareModelWithConnections();
	},

	onClickShareByTopic: function() {
		this.parent.app.shareModelByTopic();
	},

	onClickShareByMessage: function() {
		this.parent.app.shareModelByMessage();
	},

	onClickShareByLink: function() {
		this.parent.app.shareModelByLink();
	},

	onClickShareByEmail: function() {
		this.parent.app.shareModelByEmail();
	}
});