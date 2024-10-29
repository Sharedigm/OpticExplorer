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
			<a class="new-window"><i class="far fa-window-maximize"></i>New Window<span class="command shortcut">enter</span></a>
		</li>

		<li role="presentation">
			<a class="new-contact"><i class="fa fa-file"></i>New Contact<span class="shift command shortcut">enter</span></a>
		</li>
		
		<li role="presentation">
			<a class="open-item"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="presentation" class="import dropdown dropdown-submenu">
			<a class="dropdown-toggle"><i class="fa fa-cloud-upload-alt"></i>Import<i class="fa fa-caret-left"></i><i class="fa fa-caret-right"></i></a>
		
			<ul class="dropdown-menu" data-toggle="dropdown">
				<li role="presentation">
					<a class="import-google"><i class="fab fa-google"></i>Google Contacts</a>
				</li>
			</ul>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-contact"><i class="fa fa-save"></i>Save<span class="command shortcut">S</span></a>
		</li>
		
		<li role="presentation">
			<a class="save-as"><i class="fa fa-save"></i>Save As<span class="shift command shortcut">S</span></a>
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
		'click .new-window': 'onClickNewWindow',
		'click .new-contact': 'onClickNewContact',
		'click .open-item': 'onClickOpenItem',
		'click .import-google': 'onClickImportGoogle',
		'click .show-info': 'onClickShowInfo',
		'click .save-contact': 'onClickSaveContact',
		'click .save-as': 'onClickSaveAs',
		'click .close-tab': 'onClickCloseTab',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	visible: function() {
		let isSignedIn = application.isSignedIn();
		let isDesktop = this.parent.app.isDesktop();

		return {
			'new-window': true,
			'new-contact': isSignedIn,
			'open-item': isSignedIn,
			'import-google': isSignedIn,
			'show-info': true,
			'save-contact': isSignedIn,
			'save-as': isSignedIn,
			'close-tab': true,
			'close-window': !isDesktop
		};
	},

	enabled: function() {
		let hasTabs = this.parent.app.hasTabs();
		let file = this.parent.app.getActiveModel();
		let directory = file? file.parent : undefined;
		let isDirty = hasTabs && this.parent.app.isDirty();
		let isSaved = file && file.isSaved();
		let isWritable = directory? directory.isWritableBy(application.session.user) : undefined;
		let isDesktop = this.parent.app.isDesktop();
		let hasSelected = this.parent.app.hasSelected();

		return {
			'new-window': true,
			'new-contact': isWritable,
			'open-item': true,
			'import-google': true,
			'show-info': isSaved || hasSelected,
			'save-contact': isDirty && isWritable,
			'save-as': isWritable,
			'close-tab': hasTabs,
			'close-window': !isDesktop
		};
	},

	//
	// event handling methods
	//

	onSave: function() {
		this.setItemsDisabled([
			'save-contact'
		]);
	},

	//
	// mouse event handling methods
	//

	onClickNewContact: function() {
		this.parent.app.showNewContactDialog();
	},

	onClickOpenItem: function() {
		this.parent.app.open();
	},

	onClickImportGoogle: function() {
		this.parent.app.importFromGoogle();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},
	
	onClickSaveContact: function() {
		this.parent.app.save();
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs();
	},

	onClickCloseTab: function() {
		this.parent.app.closeActiveTab();
	}
});