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
			<a class="new-connection"><i class="fa fa-plus"></i>New Connection<span class="shift command shortcut">N</span></a>
		</li>

		<li role="presentation">
			<a class="open-connection"><i class="fa fa-folder-open"></i>Open<span class="command shortcut">O</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="add-group"><i class="fa fa-user-plus"></i>Add Group<span class="command shortcut">G</span></a>
		</li>
		
		<li role="presentation">
			<a class="delete-groups"><i class="fa fa-user-times"></i>Delete Groups<span class="shortcut">delete</span></a>
		</li>
		
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="show-info"><i class="fa fa-info-circle"></i>Show Info<span class="command shortcut">I</span></a>
		</li>
		
		<li role="presentation">
			<a class="show-on-map"><i class="fa fa-map"></i>Show on Map<span class="command shortcut">M</span></a>
		</li>
		
		<% if (!is_desktop) { %>
		<li role="separator" class="divider"></li>
		
		<li role="presentation">
			<a class="close-window"><i class="fa fa-circle-xmark"></i>Close<span class="command shortcut">L</span></a>
		</li>
		<% } %>
	`),

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .new-connection': 'onClickNewConnection',
		'click .open-connection': 'onClickOpenConnection',
		'click .add-group': 'onClickAddGroup',
		'click .delete-groups': 'onClickDeleteGroups',
		'click .show-info': 'onClickShowInfo',
		'click .show-on-map': 'onClickShowOnMap',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasSelected = this.parent.app.hasSelected();
		let hasSelectedGroup = this.parent.app.hasSelectedGroup() == true;
		let numSelected = this.parent.app.numSelected();
		let oneSelected = numSelected == 1;
		let hasSelectedGeolocated = this.parent.app.hasSelectedGeolocated() == true;	

		return {
			'new-window': true,
			'new-connection': isSignedIn,
			'open-connection': isSignedIn && oneSelected,
			'add-group': isSignedIn,
			'delete-groups': isSignedIn && hasSelectedGroup && !hasSelected,
			'show-info': hasSelected,
			'show-on-map': hasSelectedGeolocated,	
			'close-window': true
		};
	},

	//
	// mouse event handling methods
	//

	onClickNewConnection: function() {
		this.parent.app.showFindConnectionsDialog();
	},

	onClickOpenConnection: function() {
		this.parent.app.openConnection(this.parent.app.getSelectedModels()[0]);
	},

	onClickAddGroup: function() {
		this.parent.app.showNewGroupDialog();
	},

	onClickDeleteGroups: function() {
		this.parent.app.deleteGroups(this.parent.app.getSelectedGroups());
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickShowOnMap: function() {
		application.launch('map_viewer', {
			people: this.parent.app.getSelectedGeolocatedModels()
		});
	}
});