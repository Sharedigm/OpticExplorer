/******************************************************************************\
|                                                                              |
|                                task-list-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used to show a list of tasks.                     |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import CollectionView from '../../../../../../views/collections/collection-view.js';
import TaskListItemView from '../../../../../../views/apps/desktop/footer-bar/task-bar/task-list/task-list-item-view.js';
import Minimizable from '../../../../../../views/dialogs/behaviors/minimizable.js';

export default CollectionView.extend({

	//
	// attributes
	//

	tagName: 'ul',
	className: 'task-list',
	childView: TaskListItemView,

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.collection = Minimizable.getMinimized();
	}
});