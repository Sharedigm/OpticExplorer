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

import File from '../../../../../../models/storage/files/file.js';
import ArchiveFile from '../../../../../../models/storage/files/archive-file.js';
import Directory from '../../../../../../models/storage/directories/directory.js';
import FileMenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/file-menu-view.js';

export default FileMenuView.extend({

	//
	// attributes
	//

	events: {
		'click .new-folder': 'onClickNewFolder',
		'click .new-volume': 'onClickNewVolume',
		'click .new-text-file': 'onClickNewTextFile',
		'click .new-window': 'onClickNewWindow',
		'click .open-item': 'onClickOpenItem',
		'click .open-with': 'onClickOpenWith',
		'click .open-in-new-window': 'onClickOpenInNewWindow',
		'click .open-in-new-tab': 'onClickOpenInNewTab',
		'click .upload-item': 'onClickUpload',
		'click .upload-dropbox': 'onClickUploadDropbox',
		'click .upload-google': 'onClickUploadGoogle',
		'click .add-favorites': 'onClickAddFavorites',
		'click .remove-favorites': 'onClickRemoveFavorites',
		'click .open-first': 'onClickOpenFirst',
		'click .open-prev': 'onClickOpenPrev',
		'click .open-next': 'onClickOpenNext',
		'click .open-last': 'onClickOpenLast',
		'click .show-info': 'onClickShowInfo',
		'click .set-place': 'onClickSetPlace',
		'click .rename-item': 'onClickRenameItem',
		'click .compress-items': 'onClickCompressItems',
		'click .expand-item': 'onClickExpandItem',
		'click .download-items': 'onClickDownloadItems',
		'click .empty-trash': 'onClickEmptyTrash',
		'click .close-tab': 'onClickCloseTab',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	visible: function() {
		let isSignedIn = application.isSignedIn();
		let hasOpenFolders = this.parent.app.hasOpenFolders();
		let isWindowed = this.parent.app.isWindowed();
		let hasMapViewer = application.hasApp('map_viewer');

		return {
			'new-window': true,
			'new-folder': true,
			'new-volume': true,
			'new-text-file': true,
			'open-item': isSignedIn,
			'open-with': isSignedIn,
			'open-in-new-window': isWindowed,
			'open-in-new-tab': true,
			'open-favorites': isSignedIn,
			'upload-item': true,
			'favorites': isSignedIn,
			'add-favorites': isSignedIn,
			'remove-favorites': isSignedIn,
			'open-first': isSignedIn,
			'open-prev': isSignedIn,
			'open-next': isSignedIn,
			'open-last': isSignedIn,
			'show-info': true,
			'set-place': hasMapViewer,
			'rename-item': true,
			'compress-items': true,
			'expand-item': true,
			'download-items': true,
			'empty-trash': true,
			'close-tab': hasOpenFolders,
			'close-window': isWindowed
		};
	},

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasTabs = this.parent.app.hasTabs();
		let preferences = this.parent.app.preferences;
		let numSelected = this.parent.app.numSelected();
		let hasSelected = numSelected != 0;
		let selectedModel = this.parent.app.getSelectedModel();
		let hasSelectedFile = selectedModel instanceof File;
		let hasSelectedFolder = selectedModel instanceof Directory;
		let hasSelectedArchive = selectedModel instanceof ArchiveFile;
		let hasSelectedFavorites = this.parent.app.hasSelectedFavorites();
		let viewingMap = preferences.get('view_kind') == 'maps';
		let isDialog = this.parent.app.dialog != undefined;
		let isTrashEmpty = this.parent.app.isTrashEmpty();

		return {
			'new-window': true,
			'new-folder': true,
			'new-volume': true,
			'new-text-file': true,
			'open-item': !isDialog || hasSelected,
			'open-with': isSignedIn && hasSelectedFile,
			'open-in-new-window': hasSelectedFolder,
			'open-in-new-tab': hasSelectedFolder,
			'open-favorites': true,
			'upload-item': true,
			'favorites': true,
			'add-favorites': true,
			'remove-favorites': hasSelectedFavorites,
			'open-first': !hasSelected && !viewingMap,
			'open-prev': hasSelectedFavorites && !viewingMap,
			'open-next': hasSelectedFavorites && !viewingMap,
			'open-last': !hasSelected && !viewingMap,
			'show-info': hasSelected,
			'set-place': hasSelected,
			'rename-item': numSelected == 1,
			'compress-items': hasSelected,
			'expand-item': hasSelectedArchive,
			'download-items': hasSelected,
			'empty-trash': !isTrashEmpty,
			'close-tab': hasTabs,
			'close-window': true
		};
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// call superclass method
		//
		FileMenuView.prototype.onLoad.call(this);

		// disable empty trash
		//
		if (!application.session.user || 
			this.parent.app.isTrashEmpty()) {
			this.setItemDisabled('empty-trash');
		}
	},

	onChangeSelection: function() {
		this.setEnabled(this.enabled());
	},

	//
	// mouse event handling methods
	//

	onClickNewFolder: function() {
		this.parent.app.newFolder();
	},

	onClickNewVolume: function() {
		this.parent.app.showNewVolumeDialog();
	},

	onClickNewTextFile: function() {
		this.parent.app.createNewTextFile();
	},

	onClickOpenItem: function() {
		this.parent.app.openItems(this.parent.app.getSelectedModels());
	},

	onClickOpenWith: function() {
		this.parent.app.showOpenWithDialog(this.parent.app.getSelectedModels());
	},

	onClickOpenInNewWindow: function() {
		this.parent.app.openItems(this.parent.app.getSelectedModels(), {
			'open_folders_in_new_window': true
		});
	},

	onClickOpenInNewTab: function() {
		this.parent.app.openItems(this.parent.app.getSelectedModels(), {
			'open_folders_in_new_tab': true
		});
	},

	onClickAddFavorites: function() {
		this.parent.app.showAddFavoritesDialog();
	},

	onClickRemoveFavorites: function() {
		this.parent.app.removeSelectedFavorites();
	},
	
	onClickOpenFirst: function() {
		this.parent.app.openFavorite('first');
	},

	onClickOpenPrev: function() {
		this.parent.app.openFavorite('prev');
	},

	onClickOpenNext: function() {
		this.parent.app.openFavorite('next');
	},

	onClickOpenLast: function() {
		this.parent.app.openFavorite('last');
	},

	onClickUpload: function() {
		this.parent.app.upload();
	},

	onClickUploadDropbox: function() {
		this.parent.app.uploadDropbox();
	},

	onClickUploadGoogle: function() {
		this.parent.app.uploadGoogleDrive();
	},
	
	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickSetPlace: function() {
		this.parent.app.showSetItemPlaceDialogView(this.parent.app.getSelected()[0]);
	},

	onClickRenameItem: function() {
		this.parent.app.rename(this.parent.app.getSelected());
	},

	onClickCompressItems: function() {
		
		// compress selected items
		//
		this.parent.app.compress();
	},

	onClickExpandItem: function() {

		// expand selected items
		//
		this.parent.app.expandSelected();
	},

	onClickDownloadItems: function() {
		
		// download selected items
		//
		this.parent.app.downloadSelected();
	},

	onClickEmptyTrash: function() {
		this.parent.app.emptyTrash();

		// update menu item
		//
		this.setItemDisabled('empty-trash');
	},

	onClickCloseTab: function() {
		this.parent.app.closeActiveTab();
	}
});