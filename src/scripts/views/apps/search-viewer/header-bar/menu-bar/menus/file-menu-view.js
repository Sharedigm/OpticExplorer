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
		<li role="presentation" class="dropdown dropdown-submenu">
			<a class="open-file dropdown-toggle"><i class="fa fa-file"></i>Open File<span class="command shortcut">O</span></a>
		</li>

		<li role="separator" class="divider"></li>

		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>

		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	events: {
		'click .open-file': 'onClickOpenFile',
		'click .show-info': 'onClickShowInfo',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let hasSelected = this.parent.app.hasSelected();
		let isDesktop = this.parent.app.isDesktop();

		return {
			'open-file': hasSelected,
			'show-info': hasSelected,
			'close-window': !isDesktop
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenFile: function() {
		if (this.parent.app.hasSelected()) {
			this.parent.app.openFile(this.parent.app.getSelectedModels()[0]);
		}
	},

	onClickShowInfo: function() {
		if (this.parent.app.hasSelected()) {
			this.parent.app.showInfoDialog();
		}
	}
});