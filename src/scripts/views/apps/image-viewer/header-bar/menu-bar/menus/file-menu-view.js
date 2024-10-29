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

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="open-item"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="download-items"><i class="fa fa-download"></i>Download<span class="shift command shortcut">D</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="delete-items"><i class="fa fa-trash-alt"></i>Delete<span class="shortcut">delete</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),
	
	events: {
		'click .new-window': 'onClickNewWindow',
		'click .open-item': 'onClickOpenItem',
		'click .show-info': 'onClickShowInfo',
		'click .download-items': 'onClickDownloadItems',
		'click .delete-items': 'onClickDeleteItems',
		'click .close-window': 'onClickCloseWindow',
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let isOpen = this.parent.app.hasImage();
		let directory = this.parent.app.directory;
		let hasSelectedItems = this.parent.app.hasSelectedItems();
		let isDirectoryWritable = directory? directory.isWritableBy(application.session.user) : isSignedIn;

		return {
			'new-window': true,
			'open-item': isSignedIn,
			'show-info': isOpen,
			'download-items': isOpen,
			'delete-items': hasSelectedItems === true && isDirectoryWritable,
			'close-window': true
		};
	},
	
	//
	// mouse event handling methods
	//

	onClickOpenItem: function() {
		this.parent.app.showOpenDialog();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickDownloadItems: function() {
		this.parent.app.downloadItems();
	},

	onClickDeleteItems: function() {
		this.parent.app.deleteSelected();
	}
});