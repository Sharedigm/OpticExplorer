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
			<a class="open-file"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="save-as"><i class="fa fa-save"></i>Save As<span class="shift command shortcut">S</span></a>
		</li>

		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="download-file"><i class="fa fa-download"></i>Download<span class="shift command shortcut">D</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-file"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	disabled: {
		'download': true
	},

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .open-file': 'onClickOpenFile',
		'click .show-info': 'onClickShowInfo',
		'click .save-as': 'onClickSaveAs',
		'click .download-file': 'onClickDownloadFile',
		'click .close-file': 'onClickCloseFile',
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		
		return {
			'new-window': true,
			'open-file': isSignedIn,
			'show-info': this.parent.app.model != null,
			'save-as': isSignedIn,
			'download-file': this.parent.app.model != null,
			'close-file': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenFile: function() {
		this.parent.app.showOpenDialog();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs();
	},

	onClickDownloadFile: function() {
		this.parent.app.downloadFile();
	},

	onClickCloseFile: function() {
		this.parent.app.close();
	}
});