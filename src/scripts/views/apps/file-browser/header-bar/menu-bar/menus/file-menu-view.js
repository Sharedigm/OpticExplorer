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

	template: template(`
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="new dropdown-toggle"><i class="fa fa-magic"></i>New<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="new-folder"><i class="fa fa-folder"></i>New Folder<span class="command shortcut">enter</span></a>
				</li>

				<li role="presentation">
					<a class="new-volume"><i class="fa fa-database"></i>New Volume<span class="shift command shortcut">L</span></a>
				</li>

				<li role="presentation">
					<a class="new-text-file"><i class="fa fa-file-alt"></i>New Text File<span class="command shortcut">T</span></a>
				</li>

				<li role="presentation">
					<a class="new-window"><i class="far fa-window-maximize"></i>New Window<span class="shift command shortcut">enter</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="open-item dropdown-toggle"><i class="fa fa-folder-open"></i>Open<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i><span class="command shortcut">O</span></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="open-in-new-window"><i class="fa fa-folder-open"></i>In New Window</a>
				</li>
		
				<li role="presentation">
					<a class="open-in-new-tab"><i class="fa fa-folder-open"></i>In New Tab</a>
				</li>
			</ul>
		</li>
		
		<li role="presentation">
			<a class="open-with"><i class="fa fa-folder-open"></i>Open With</a>
		</li>
		
		<li role="presentation" class="import dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-cloud-upload-alt"></i>Import<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
		
				<li role="presentation">
					<a class="upload-item"><i class="fa fa-upload"></i>Upload<span class="command shortcut">U</span></a>
				</li>
		
				<li role="presentation">
					<a class="upload-dropbox"><i class="fab fa-dropbox"></i>Dropbox</a>
				</li>
		
				<li role="presentation">
					<a class="upload-google"><i class="fab fa-google"></i>Google Drive</a>
				</li>
			</ul>
		</li>
		
		<% if (!is_desktop) { %>
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
		
				<li role="separator" class="divider"></li>
		
				<li role="presentation">
					<a class="open-first"><i class="fa fa-fast-backward"></i>First Favorite</a>
				</li>
		
				<li role="presentation">
					<a class="open-prev"><i class="fa fa-backward"></i>Prev Favorite<span class="shortcut">left arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="open-next"><i class="fa fa-forward"></i>Next Favorite<span class="shortcut">right arrow</span></a>
				</li>
		
				<li role="presentation">
					<a class="open-last"><i class="fa fa-fast-forward"></i>Last Favorite</a>
				</li>
			</ul>
		</li>
		<% } %>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="presentation">
			<a class="show-on-map"><i class="fa fa-map"></i>Show on Map<span class="command shortcut">M</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="rename-item"><i class="fa fa-font"></i>Rename<span class="shift command shortcut">R</span></a>
		</li>

		<li role="presentation">
			<a class="compress-items"><i class="fa fa-compress"></i>Compress<span class="shift command shortcut">Z</span></a>
		</li>

		<li role="presentation">
			<a class="expand-item"><i class="fa fa-expand"></i>Expand<span class="shift command shortcut">X</span></a>
		</li>
		
		<li role="presentation">
			<a class="download-items"><i class="fa fa-download"></i>Download<span class="shift command shortcut">D</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<% if (config.defaults.search && config.defaults.search.index) { %>
		<li role="presentation">
			<a class="index-items"><i class="fa fa-list"></i>Index Items</a>
		</li>

		<li role="presentation">
			<a class="unindex-items"><i class="fa fa-close"></i>Unindex Items</a>
		</li>

		<li role="separator" class="divider"></li>
		<% } %>

		<li role="presentation">
			<a class="close-tab"><i class="fa fa-xmark"></i>Close Tab<span class="command shortcut">L</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="empty-trash"><i class="fa fa-trash-alt"></i>Empty Trash<span class="command shortcut">E</span></a>
		</li>

		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

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
		'click .show-on-map': 'onClickShowOnMap',
		'click .rename-item': 'onClickRenameItem',
		'click .compress-items': 'onClickCompressItems',
		'click .expand-item': 'onClickExpandItem',
		'click .download-items': 'onClickDownloadItems',
		'click .index-items': 'onClickIndexItems',
		'click .unindex-items': 'onClickUnindexItems',
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
		let isDesktop = this.parent.app.isDesktop();

		return {
			'new-window': true,
			'new-folder': true,
			'new-volume': true,
			'new-text-file': true,
			'open-item': isSignedIn,
			'open-with': isSignedIn,
			'open-in-new-window': !isDesktop,
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
			'show-on-map': true,
			'rename-item': true,
			'compress-items': true,
			'expand-item': true,
			'download-items': true,
			'index-items': true,
			'unindex-items': true,
			'empty-trash': true,
			'close-tab': hasOpenFolders,
			'close-window': !isDesktop
		};
	},

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasTabs = this.parent.app.hasTabs();
		let preferences = this.parent.app.preferences;
		let numSelected = this.parent.app.numSelected();
		let hasSelected = numSelected != 0;
		let selectedModel = this.parent.app.getSelectedModels()[0];
		let hasSelectedFile = selectedModel instanceof File;
		let hasSelectedFolder = selectedModel instanceof Directory;
		let hasSelectedArchive = selectedModel instanceof ArchiveFile;
		let hasSelectedGeolocated = this.parent.app.hasSelectedGeolocated();
		let hasSelectedFavorites = this.parent.app.hasSelectedFavorites();
		let viewingMap = preferences.get('view_kind') == 'maps';
		let isDialog = this.parent.app.dialog != undefined;
		let isTrashEmpty = this.parent.app.isTrashEmpty();
		let isDesktop = this.parent.app.isDesktop();

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
			'show-on-map': hasSelectedGeolocated,
			'rename-item': numSelected == 1,
			'compress-items': hasSelected,
			'expand-item': hasSelectedArchive,
			'download-items': hasSelected,
			'index-items': hasSelected,
			'unindex-items': hasSelected,
			'empty-trash': !isTrashEmpty,
			'close-tab': hasTabs,
			'close-window': !isDesktop
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
		this.parent.app.addFavorites();
	},

	onClickRemoveFavorites: function() {
		this.parent.app.removeFavorites(this.parent.app.getSelectedFavorites());
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

	onClickShowOnMap: function() {
		application.launch('map_viewer', {
			photos: this.parent.app.getSelectedGeolocatedModels()
		});
	},

	onClickRenameItem: function() {
		this.parent.app.rename(this.parent.app.getChildren((item) => item.isSelected()));
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

	onClickIndexItems: function() {

		// index selected items
		//
		this.parent.app.indexSelected();
	},

	onClickUnindexItems: function() {

		// unindex selected items
		//
		this.parent.app.unindexSelected();
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