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
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FileMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/file-menu-view.js';

export default FileMenuView.extend({

	//
	// attributes
	//
	
	events: {
		'click .new-wavelengths': 'onClickNewWavelengths',
		'click .new-folder': 'onClickNewFolder',
		'click .new-window': 'onClickNewWindow',
		'click .open-wavelengths': 'onClickOpenWavelengths',
		'click .show-info': 'onClickShowInfo',
		'click .save-wavelengths': 'onClickSave',
		'click .save-as': 'onClickSaveAs',
		'click .delete-items': 'onClickDeleteItems',
		'click .close-tab': 'onClickCloseTab',
		'click .close-window': 'onClickCloseWindow',
	},
	
	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasTabs = this.parent.app.hasTabs();
		let hasSelectedItems = this.parent.app.hasSelectedItems();
		let isDirty = this.parent.app.isDirty();
		let isDesktop = this.parent.app.isDesktop();

		return {
			'new-wavelengths': true,
			'new-folder': isSignedIn,
			'new-window': true,
			'open-wavelengths': isSignedIn,
			'show-info': hasTabs,
			'save-wavelengths': hasTabs && isSignedIn && isDirty,
			'save-as': hasTabs && isSignedIn,
			'delete-items': isSignedIn && hasSelectedItems,
			'close-tab': hasTabs,
			'close-window': !isDesktop
		};
	},

	//
	// mouse event handling methods
	//

	onClickNewWavelengths: function() {
		this.parent.app.newWavelengths();
	},

	onClickNewWindow: function() {
		this.parent.app.newWindow();
	},

	onClickNewFolder: function() {
		this.parent.app.newFolder();
	},

	onClickOpenWavelengths: function() {
		this.parent.app.openSelected();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickSaveWavelengths: function() {
		this.parent.app.save();
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs();
	},

	onClickDeleteItems: function() {
		this.parent.app.deleteSelectedItems();
	},

	onClickCloseTab: function() {
		this.parent.app.closeActiveTab();
	},

	onClickCloseWindow: function() {
		this.parent.app.close();
	}
});