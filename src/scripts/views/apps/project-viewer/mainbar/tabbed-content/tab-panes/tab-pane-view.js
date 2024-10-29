/******************************************************************************\
|                                                                              |
|                               tab-pane-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying code tabs.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Project from '../../../../../../models/projects/project.js';
import Task from '../../../../../../models/projects/task.js';
import TabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/tab-panes/tab-pane-view.js';
import ContainableSelectable from '../../../../../../views/behaviors/containers/containable-selectable.js';
import ProjectView from '../../../../../../views/apps/project-viewer/mainbar/projects/project-view.js';
import TaskView from '../../../../../../views/apps/project-viewer/mainbar/tasks/task-view.js';

export default TabPaneView.extend(_.extend({}, ContainableSelectable, {

	//
	// iterator
	//

	each: function(callback, filter, options) {
		if (this.hasChildView('content')) {
			let contentView = this.getChildView('content');

			// project views have an 'each', task views do not
			//
			if (contentView.each) {
				contentView.each(callback, filter, options);
			}
		}
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		this.getChildView('content').setOption(key, value);
	},

	//
	// rendering methods
	//

	getContentView: function() {

		// show project
		//
		if (this.model instanceof Project) {
			return new ProjectView(this.options);

		// show task
		//
		} else if (this.model instanceof Task) {
			return new TaskView(this.options);
		}
	}
}));