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
					<a class="new-optic"><i class="fa fa-database rotated flipped"></i>New Optic<span class="command shortcut">enter</span></a>
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
			<a class="open-optics"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>

		<li role="presentation">
			<a class="revert-optic"><i class="fa fa-repeat"></i>Revert<span class="command shift shortcut">R</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="presentation">
			<a class="show-material-map"><i class="fa fa-map"></i>Show Material Map<span class="command shortcut">M</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-optic"><i class="fa fa-save"></i>Save<span class="command shortcut">S</span></a>
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
		let isDesktop = this.parent.app.isDesktop();

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
			'close-window': !isDesktop
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