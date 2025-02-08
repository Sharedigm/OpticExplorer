/******************************************************************************\
|                                                                              |
|                               file-menu-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a view for displaying file dropdown menus.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/file-menu-view.js';

export default FileMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .open-profiles': 'onClickOpenProfiles',
		'click .show-info': 'onClickShowInfo',
		'click .delete-accounts': 'onClickDeleteAccounts',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();

		return {
			'new-window': true,
			'open-profiles': hasSelected,
			'show-info': hasSelected,
			'delete-accounts': hasSelected,
			'close-window': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenProfiles: function() {
		this.parent.app.openSelected();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfo();
	}
});