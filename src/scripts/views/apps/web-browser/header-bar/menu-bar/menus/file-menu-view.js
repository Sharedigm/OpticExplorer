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

	template: template(`
		<li role="presentation">
			<a class="new-window"><i class="fa fa-file"></i>New Window<span class="shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-url"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="add-to-favorites"><i class="fa fa-star"></i>Add to Favorites<span class="command shortcut">=</span></a>
		</li>
		
		<li role="presentation">
			<a class="delete-favorites"><i class="fa fa-trash-alt"></i>Delete Favorites<span class="shortcut">delete</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-url-as"><i class="fa fa-save"></i>Save As<span class="command shortcut">S</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

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

	onClickCloseWindow: function() {
		this.parent.app.close();
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