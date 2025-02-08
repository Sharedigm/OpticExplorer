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
		'click .open-first': 'onClickOpenFirst',
		'click .open-prev': 'onClickOpenPrev',
		'click .open-next': 'onClickOpenNext',
		'click .open-last': 'onClickOpenLast',
		'click .add-favorites': 'onClickAddFavorites',
		'click .remove-favorites': 'onClickRemoveFavorites',
		'click .show-info': 'onClickShowInfo',
		'click .download-file': 'onClickDownloadFile',
		'click .delete-items': 'onClickDeleteItems',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let isOpen = this.parent.app.model != null;
		let isMultiple = this.parent.app.collection.length > 1;
		let hasSelected = this.parent.app.hasSelected();
		let hasSelectedFavorites = this.parent.app.hasSelectedFavorites();
		let hasSelectedItems = this.parent.app.hasSelectedItems();

		return {
			'new-window': true,
			'open-file': isSignedIn,
			'open-track': isMultiple,
			'open-first': isMultiple,
			'open-prev': isMultiple,
			'open-next': isMultiple,
			'open-last': isMultiple,
			'add-favorites': isSignedIn,
			'remove-favorites': hasSelectedFavorites,
			'show-info': isOpen,
			'download-file': hasSelected,
			'delete-items': isSignedIn && hasSelectedItems,
			'close-window': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenFirst: function() {
		this.parent.app.setTrackNumber(this.parent.app.getTrackNumber('first'));
	},

	onClickOpenPrev: function() {
		this.parent.app.setTrackNumber(this.parent.app.getTrackNumber('prev', {
			wraparound: true
		}));
	},

	onClickOpenNext: function() {
		this.parent.app.setTrackNumber(this.parent.app.getTrackNumber('next', {
			wraparound: true
		}));
	},

	onClickOpenLast: function() {
		this.parent.app.setTrackNumber(this.parent.app.getTrackNumber('last'));
	},

	onClickAddFavorites: function() {
		this.parent.app.showAddFavoritesDialog();
	},

	onClickRemoveFavorites: function() {
		this.parent.app.removeSelectedFavorites();
	},
	
	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickDownloadFile: function() {
		this.parent.app.downloadFile();
	},

	onClickDeleteItems: function() {
		this.parent.app.deleteSelectedItems();
	}
});