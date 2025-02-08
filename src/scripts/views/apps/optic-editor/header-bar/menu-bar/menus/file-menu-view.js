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
		'click .new-optic': 'onClickNewOptic',
		'click .new-folder': 'onClickNewFolder',
		'click .new-window': 'onClickNewWindow',
		'click .open-optics': 'onClickOpenOptics',
		'click .revert-optic': 'onClickRevertOptic',
		'click .show-info': 'onClickShowInfo',
		'click .show-material-map': 'onClickShowMaterialMap',
		'click .save-optic': 'onClickSave',
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
		let file = hasTabs && this.parent.app.getActiveModel();
		let isSaved = file && file.isSaved();
		let hasSelectedItems = this.parent.app.hasSelectedItems();
		let isDirty = hasTabs && this.parent.app.isDirty();
		let isWindowed = this.parent.app.isWindowed();

		return {
			'new-optic': true,
			'new-folder': isSignedIn,
			'new-window': true,
			'open-optics': isSignedIn,
			'revert-optic': isDirty && isSaved,
			'show-info': hasTabs,
			'show-material-map': hasTabs,
			'save-optic': isSignedIn && isDirty,
			'save-as': isSignedIn && hasTabs,
			'delete-items': isSignedIn && hasSelectedItems,
			'close-tab': hasTabs,
			'close-window': isWindowed
		};
	},

	//
	// mouse event handling methods
	//

	onClickNewOptic: function() {
		this.parent.app.newFile();
	},

	onClickNewWindow: function() {
		this.parent.app.newWindow();
	},

	onClickNewFolder: function() {
		this.parent.app.newFolder();
	},

	onClickOpenOptics: function() {
		this.parent.app.openSelected();
	},

	onClickRevertOptic: function() {
		this.parent.app.revertOptic();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickShowMaterialMap: function() {
		this.parent.app.showMaterialMap();
	},

	onClickSaveOptic: function() {
		this.parent.app.save();
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs({
			extensions: ['optc', 'zmx']
		});
	},

	onClickExportOptic: function() {
		this.parent.app.exportOptic();
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