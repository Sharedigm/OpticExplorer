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
		'click .open-profile': 'onClickOpenProfile',
		'click .show-info': 'onClickShowInfo',
		'click .export-as': 'onClickExportAs',
		'click .close-profile': 'onClickCloseProfile',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let isCurrentUser = this.parent.app.model.isCurrent();

		return {
			'new-window': true,
			'open-profile': isSignedIn,
			'show-info': !isCurrentUser,
			'export-as': isSignedIn,
			'close-profile': true,
			'close-window': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenProfile: function() {
		this.parent.app.showOpenConnectionsDialog();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickExportAs: function() {
		this.parent.app.exportAs();
	},
	
	onClickCloseProfile: function() {
		this.parent.app.close();
	}
});