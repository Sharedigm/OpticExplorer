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

	events: {
		'click .new-window': 'onClickNewWindow',
		'click .new-task': 'onClickNewTask',
		'click .new-project': 'onClickNewProject',
		'click .open-projects': 'onClickOpenProjects',
		'click .add-projects': 'onClickAddProjects',
		'click .remove-project': 'onClickRemoveProject',
		'click .show-info': 'onClickShowInfo',
		'click .download-item': 'onClickDownloadItem',
		'click .close-tab': 'onClickCloseTab',
		'click .close-window': 'onClickCloseWindow'
	},

	//
	// querying methods
	//

	enabled: function() {
		let isSignedIn = application.isSignedIn();
		let hasTabs = this.parent.app.hasTabs();
		let hasOpenProject = this.parent.app.hasOpenProject();
		let hasSelected = this.parent.app.hasSelected();

		return {
			'new-window': true,
			'new-task': true,
			'new-project': isSignedIn,
			'open-projects': isSignedIn,
			'add-projects': false,
			'remove-project': false,
			'show-info': hasSelected || hasOpenProject,
			'download-item': false,
			'close-tab': hasTabs,
			'close-window': true
		};
	},

	//
	// setting methods
	//

	setProject: function(project) {
		this.setItemDisabled('remove-project', project.isOwnedBy(application.session.user));
	},
	
	//
	// selection event handling methods
	//

	onSelect: function() {
		this.onChange();
	},

	onDeselect: function() {
		this.onChange();
	},

	//
	// mouse event handling methods
	//

	onClickNewTask: function() {
		this.parent.app.showNewTaskDialog('task');
	},

	onClickNewProject: function() {
		this.parent.app.showNewProjectDialog();
	},

	onClickOpenProjects: function() {
		this.parent.app.showOpenProjectsDialog();
	},

	onClickAddProjects: function() {
		this.parent.app.showAddProjectsDialog();
	},

	onClickRemoveProject: function() {
		this.parent.app.removeProject();
	},

	onClickShowInfo: function() {
		this.parent.app.showInfoDialog();
	},

	onClickDownloadItem: function() {
		this.parent.app.downloadItem();
	},

	onClickCloseTab: function() {
		this.parent.app.closeTab();
	}
});