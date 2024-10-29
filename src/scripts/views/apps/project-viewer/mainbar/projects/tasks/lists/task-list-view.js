/******************************************************************************\
|                                                                              |
|                               task-list-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a list of project task list items.             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../../../../../views/items/lists/list-view.js';
import TaskListItemView from '../../../../../../../views/apps/project-viewer/mainbar/projects/tasks/lists/task-list-item-view.js';

export default ListView.extend({

	//
	// attributes
	//

	childView: TaskListItemView,
	editable: false
});