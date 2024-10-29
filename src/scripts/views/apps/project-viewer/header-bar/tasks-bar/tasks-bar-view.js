/******************************************************************************\
|                                                                              |
|                               tasks-bar-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a tasks toolbar.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ToolbarView from '../../../../../views/apps/common/toolbars/toolbar-view.js';
import NewTaskButtonView from '../../../../../views/apps/project-viewer/header-bar/tasks-bar/buttons/new-task-button-view.js';
import NewBugButtonView from '../../../../../views/apps/project-viewer/header-bar/tasks-bar/buttons/new-bug-button-view.js';
import NewFeatureButtonView from '../../../../../views/apps/project-viewer/header-bar/tasks-bar/buttons/new-feature-button-view.js';

export default ToolbarView.extend({

	//
	// attributes
	//

	className: 'toolbar',

	template: template(`
		<div class="new-task" data-toggle="tooltip" title="New Task" data-placement="bottom"></div>
		<div class="new-bug" data-toggle="tooltip" title="New Bug" data-placement="bottom"></div>
		<div class="new-feature" data-toggle="tooltip" title="New Feature" data-placement="bottom"></div>
	`),

	regions: {
		task: '.new-task',
		bug: '.new-bug',
		feature: '.new-feature'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ToolbarView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('task', new NewTaskButtonView());
		this.showChildView('bug', new NewBugButtonView());
		this.showChildView('feature', new NewFeatureButtonView());
	}
});
