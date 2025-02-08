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
		'click .open-url': 'onClickOpenUrl',
		'click .add-to-favorites': 'onClickAddToFavorites',
		'click .delete-favorites': 'onClickDeleteFavorites',
		'click .save-url': 'onClickSaveUrl',
		'click .save-url-as': 'onClickSaveUrlAs',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		return {
			'new-window': true,
			'open-url': application.isSignedIn(),
			'add-to-favorites': application.isSignedIn(),
			'delete-favorites': application.isSignedIn(),
			'save-url': false,
			'save-url-as': application.isSignedIn(),
			'close-window': true
		};
	},
	
	//
	// mouse event handling methods
	//

	onClickNewWindow: function() {
		this.parent.app.newWindow({
			url: this.parent.app.url
		});
	},

	onClickOpenUrl: function() {
		this.parent.app.showOpenUrlDialog();
	},

	onClickAddToFavorites: function() {
		this.parent.app.addToFavorites();
	},

	onClickDeleteFavorites: function() {
		if (this.parent.app.hasSelected()) {
			this.parent.app.deleteFavorites(this.parent.app.getSelected());
		}
	},

	onClickSaveUrl: function() {
		this.parent.app.saveUrl(this.parent.app.getUrl());
	},

	onClickSaveUrlAs: function() {
		this.parent.app.showSaveAsDialog(this.parent.app.getUrl());
	},

	//
	// selection event handling methods
	//

	onSelect: function() {
		this.setItemEnabled('delete-favorites');
	},

	onDeselect: function() {
		this.setItemDisabled('delete-favorites');
	}
});