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
			<a class="open-theme"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="save-as"><i class="fa fa-save"></i>Save As<span class="command shortcut">S</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	events: {
		'click .open-theme': 'onClickOpenTheme',
		'click .open-my-theme': 'onClickOpenMyTheme',
		'click .save-as': 'onClickSaveAs',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// mouse event handling methods
	//

	onClickOpenTheme: function() {
		this.parent.app.openTheme({
			local: false
		});
	},

	onClickOpenMTheme: function() {
		this.parent.app.openTheme({
			local: true
		});
	},

	onClickSaveAs: function() {
		this.parent.app.saveAs();
	}
});