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
			<a class="new-file"><i class="fa fa-file-code"></i>New File<span class="command shortcut">enter</span></a>
		</li>

		<li role="presentation">
			<a class="new-window"><i class="far fa-window-maximize"></i>New Window<span class="shift command shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-file"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="favorites dropdown-toggle"><i class="fa fa-star"></i>Favorites<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>

			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="add-favorites"><i class="fa fa-star"></i>Add Favorites<span class="shift command shortcut">F</span></a>
				</li>

				<li role="presentation">
					<a class="remove-favorites"><i class="fa fa-trash-alt"></i>Remove Favorites<span class="shortcut">delete</span></a>
				</li>
			</ul>
		</li>

		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-file"><i class="fa fa-save"></i>Save<span class="command shortcut">S</span></a>
		</li>
		
		<li role="presentation">
			<a class="save-as"><i class="fa fa-save"></i>Save As<span class="shift command shortcut">S</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="delete-items"><i class="fa fa-trash-alt"></i>Delete<span class="command shortcut">delete</span></a>
		</li>

		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-tab"><i class="fa fa-xmark"></i>Close Tab<span class="command shortcut">L</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	events: {
		'click .new-file': 'onClickNewFile',
		'click .new-window': 'onClickNewWindow',
		'click .open-file': 'onClickOpenFile',
		'click .add-favorites': 'onClickAddFavorites',
		'click .remove-favorites': 'onClickRemoveFavorites',
		'click .show-info': 'onClickShowInfo',
		'click .save-file': 'onClickSaveFile',
		'click .save-as': 'onClickSaveAs',
		'click .delete-items': 'onClickDeleteItems',
		'click .close-tab': 'onClickCloseTab',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasTabs = this.parent.app.hasTabs();
		let file = this.parent.app.model;
		let directory = file? file.parent : null;
		let isDirectoryReadable = directory? directory.isReadableBy(application.session.user) : isSignedIn;
		let isWritable = file? file.isWritableBy(application.session.user) : false;
		let hasSelectedFavorites = this.parent.app.hasSelectedFavorites();
		let hasSelectedItems = this.parent.app.hasSelectedItems();
		let isDirty = hasTabs && this.parent.app.isDirty();
		let isDesktop = this.parent.app.isDesktop();

		return {
			'new-file': true,
			'new-window': true,
			'open-file': isDirectoryReadable,
			'add-favorites': isSignedIn,
			'remove-favorites': hasSelectedFavorites,
			'show-info': file != undefined && !file.isNew(),
			'save-file': isSignedIn && isDirty && isWritable,
			'save-as': hasTabs && isSignedIn,
			'delete-items': isSignedIn && hasSelectedItems,
			'close-tab': hasTabs,
			'close-window': !isDesktop
		};
	},

	//
	// event handling methods
	//

	onSave: function() {
		this.setItemDisabled('save-file');
	},

	//
	// mouse event handling methods
	//

	onClickNewFile: function() {
		this.parent.app.newFile();
	},

	onClickOpenFile: function() {
		this.parent.app.showOpenDialog();
	},

	onClickAddFavorites: function() {
		this.parent.app.addFavorites();
	},

	onClickRemoveFavorites: function() {
		this.parent.app.removeFavorites(this.parent.app.getSelectedFavorites());
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

	onClickDeleteItems: function() {
		this.parent.app.deleteSelectedItems();
	},

	onClickCloseTab: function() {
		this.parent.app.closeActiveTab();
	}
});