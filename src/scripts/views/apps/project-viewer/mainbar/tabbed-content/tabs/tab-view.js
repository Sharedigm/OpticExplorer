/******************************************************************************\
|                                                                              |
|                                 tab-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for showing a single tab.                    |
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
import TabView from '../../../../../../views/apps/common/mainbar/tabbed-content/tabs/tab-view.js';

export default TabView.extend({

	//
	// getting methods
	//

	getIcon: function() {
		if (this.model instanceof Project) {
			return '<i class="fa fa-clipboard"></i>';
		} else if (this.model instanceof Task) {
			return '<i class="fa ' + this.model.getIcon() + '"></i>';
		}
	},

	getName: function() {
		if (this.model instanceof Project) {
			return this.model.getName();
		} else if (this.model instanceof Task) {
			return this.model.get('title');
		}
	},
});