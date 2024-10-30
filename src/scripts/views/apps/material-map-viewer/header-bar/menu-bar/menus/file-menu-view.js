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

	template: template(`
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="new dropdown-toggle"><i class="fa fa-magic"></i>New<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="new-map"><i class="fa fa-map"></i>New Material Map<span class="command shortcut">M</span></a>
				</li>

				<li role="presentation">
					<a class="new-folder"><i class="fa fa-folder"></i>New Folder<span class="command shortcut">enter</span></a>
				</li>

				<li role="presentation">
					<a class="new-window"><i class="far fa-window-maximize"></i>New Window<span class="shift command shortcut">enter</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation">
			<a class="open-item"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-map"><i class="fa fa-save"></i>Save<span class="command shortcut">S</span></a>
		</li>
		
		<li role="presentation">
			<a class="save-as"><i class="fa fa-save"></i>Save As<span class="shift command shortcut">S</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="delete-items"><i class="fa fa-trash-alt"></i>Delete Items<span class="command shortcut">delete</span></a>
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
		'click .new-map': 'onClickNewMap',
		'click .new-folder': 'onClickNewFolder',
		'click .new-window': 'onClickNewWindow',
		'click .open-item': 'onClickOpenItem',
		'click .show-info': 'onClickShowInfo',
		'click .save-map': 'onClickSaveMap',
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
		let directory = file? file.parent : undefined;
		let isSaved = file && file.isSaved();
		let hasSelectedItems = this.parent.app.hasSelectedItems();
		let isWritable = file? file.isWritableBy(application.session.user) : false;
		let isDirectoryWritable = directory? directory.isWritableBy(application.session.user) : isSignedIn;
		let isDesktop = this.parent.app.isDesktop();

		return {
			'new-map': true,
			'new-folder': isSignedIn,
			'new-window': true,
			'open-item': isSignedIn,
			'show-info': hasTabs,
			'save-map': isSignedIn && isSaved && isWritable,
			'save-as': hasTabs && isSignedIn,
			'delete-items': hasSelectedItems === true && isDirectoryWritable,
			'close-tab': hasTabs,
			'close-window': !isDesktop
		};
	},

	//
	// event handling methods
	//

	onSave: function() {
		this.setItemDisabled('save-map');
	},

	//
	// mouse event handling methods
	//

	onClickNewMap: function() {
		this.parent.app.newFile();
	},

	onClickNewFolder: function() {
		this.parent.app.newFolder();
	},

	onClickNewWindow: function() {
		this.parent.app.newWindow();
	},

	onClickOpenItem: function() {
		this.parent.app.openSelected();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickDeleteItems: function() {
		this.parent.app.deleteSelectedItems();
	},

	onClickSaveMap: function() {
		this.parent.app.save();
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs();
	},

	onClickCloseTab: function() {
		this.parent.app.closeActiveTab();
	},

	onClickCloseWindow: function() {
		this.parent.app.close();
	}
});