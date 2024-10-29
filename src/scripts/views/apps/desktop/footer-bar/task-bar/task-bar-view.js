/******************************************************************************\
|                                                                              |
|                               task-bar-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an app used for managing files and applications.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../views/base-view.js';
import AppsView from '../../../../../views/apps/common/apps-view.js';
import TaskListView from '../../../../../views/apps/desktop/footer-bar/task-bar/task-list/task-list-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	className: 'task-bar',

	template: template(`
		<div class="pinned-items"></div> 
		<div class="tasks"></div>
	`), 

	regions: {
		pinned: '.pinned-items',
		tasks: {
			el: '.tasks',
			replaceElement: true
		}
	},

	events: {
		'click .pinned .icon': 'onClickPinnedIcon'
	},

	//
	// methods
	//

	unminimizeAll: function() {
		let collection = this.getChildView('tasks').collection;
		let modals = [];
		for (let i = 0; i < collection.length; i++) {
			let task = collection.at(i);
			modals.push(task.get('view'));
		}
		for (let i = 0; i < modals.length; i++) {
			modals[i].unminimize();
		}
	},

	//
	// rendering methods
	//

	onRender: function() {
		let pinnedApps = config.defaults.desktop.preferences.pinned_apps;
		
		// show child views
		//
		if (pinnedApps && pinnedApps.length > 0 && this.options.show_pinned_apps != false) {
			this.showPinnedItems(pinnedApps);
		}
		this.showTaskList();
	},

	//
	// rendering methods
	//

	showPinnedItems: function(apps) {
		this.showChildView('pinned', new AppsView({

			// options
			//
			apps: apps,

			// callbacks
			//
			onclick: (app) => {
				application.launch(app);
			}
		}));
	},

	showTaskList: function() {
		this.showChildView('tasks', new TaskListView());
	}
});