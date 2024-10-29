/******************************************************************************\
|                                                                              |
|                                 tasks-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying project tasks.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemsView from '../../../../../../views/items/items-view.js';
import TaskIconsView from '../../../../../../views/apps/project-viewer/mainbar/projects/tasks/icons/task-icons-view.js';
import TaskListView from '../../../../../../views/apps/project-viewer/mainbar/projects/tasks/lists/task-list-view.js';
import TaskTilesView from '../../../../../../views/apps/project-viewer/mainbar/projects/tasks/tiles/task-tiles-view.js';
import TaskCardsView from '../../../../../../views/apps/project-viewer/mainbar/projects/tasks/cards/task-cards-view.js';

export default ItemsView.extend({

	//
	// rendering methods
	//

	showIcons: function() {

		// show project icons
		//
		this.showChildView('items', new TaskIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showLists: function(inline) {

		// show project list
		//
		this.showChildView('items', new TaskListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			inline: inline
		})));
	},

	showTiles: function() {
		
		// show tile grid
		//
		this.showChildView('items', new TaskTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showCards: function() {
		
		// show card grid
		//
		this.showChildView('items', new TaskCardsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	}
});