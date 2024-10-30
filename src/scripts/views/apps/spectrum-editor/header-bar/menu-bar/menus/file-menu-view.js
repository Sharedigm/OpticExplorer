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

import MenuView from '../../../../../../views/apps/common/header-bar/menu-bar/menus/menu-view.js';

export default MenuView.extend({

	//
	// attributes
	//

	template: template(`
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="new dropdown-toggle"><i class="fa fa-magic"></i>New<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">

				<li role="presentation">
					<a class="new-wavelengths"><i class="fa fa-rainbow"></i>New Wavelengths<span class="command shortcut">enter</span></a>
				</li>

				<li role="presentation">
					<a class="new-folder"><i class="fa fa-folder"></i>New Folder</a>
				</li>

				<li role="presentation">
					<a class="new-window"><i class="far fa-window-maximize"></i>New Window<span class="shift command shortcut">enter</span></a>
				</li>
			</ul>
		</li>
		
		<li role="presentation">
			<a class="open-wavelengths"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-wavelengths"><i class="fa fa-save"></i>Save<span class="command shortcut">S</span></a>
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