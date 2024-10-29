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

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .new-file': 'onClickNewFile',
		'click .open-file': 'onClickOpenFile',
		'click .show-info': 'onClickShowInfo',
		'click .save-file': 'onClickSaveFile',
		'click .save-as': 'onClickSaveAs',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// mouse event handling methods
	//

	onClickNewWindow: function() {
		this.parent.app.newWindow();
	},

	onClickNewFile: function() {
		this.parent.app.newFile();
	},

	onClickOpenFile: function() {
		this.parent.app.openFile();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},
	
	onClickSaveFile: function() {
		this.parent.app.save();
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs();
	},

	onClickCloseWindow: function() {
		this.parent.app.close();
	}
});