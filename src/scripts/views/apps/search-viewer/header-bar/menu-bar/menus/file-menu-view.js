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
		'click .open-file': 'onClickOpenFile',
		'click .show-info': 'onClickShowInfo',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();

		return {
			'new-window': true,
			'open-file': hasSelected,
			'show-info': hasSelected,
			'close-window': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenFile: function() {
		if (this.parent.app.hasSelected()) {
			this.parent.app.openFile(this.parent.app.getSelectedModel());
		}
	},

	onClickShowInfo: function() {
		if (this.parent.app.hasSelected()) {
			this.parent.app.showInfoDialog();
		}
	}
});