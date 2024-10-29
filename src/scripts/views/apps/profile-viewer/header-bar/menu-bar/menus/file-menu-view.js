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
			<a class="open-profile"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="presentation">
			<a class="export-as"><i class="fa fa-save"></i>Export As<span class="command shortcut">S</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-profile"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .open-profile': 'onClickOpenProfile',
		'click .show-info': 'onClickShowInfo',
		'click .export-as': 'onClickExportAs',
		'click .close-profile': 'onClickCloseProfile'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let isCurrentUser = this.parent.app.model.isCurrent();

		return {
			'new-window': true,
			'open-profile': isSignedIn,
			'show-info': !isCurrentUser,
			'export-as': isSignedIn,
			'close-profile': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickOpenProfile: function() {
		this.parent.app.showOpenConnectionsDialog();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickExportAs: function() {
		this.parent.app.exportAs();
	},
	
	onClickCloseProfile: function() {
		this.parent.app.close();
	}
});