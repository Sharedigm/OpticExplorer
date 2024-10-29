/******************************************************************************\
|                                                                              |
|                            group-tree-list-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an item list view of a connections group.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ListView from '../../../../../../views/items/lists/list-view.js';
import TreeContainable from '../../../../../../views/behaviors/containers/tree-containable.js';
import GroupTreeView from '../../../../../../views/apps/connection-manager/sidebar/groups/trees/group-tree-view.js';

export default ListView.extend(_.extend({}, TreeContainable, {

	//
	// attributes
	//

	empty: "No groups.",

	//
	// views
	//

	childView: GroupTreeView,

	//
	// constructor
	//

	initialize: function() {

		// watch collection for changes
		//
		this.collection.on('add', this.update, this);
		this.collection.on('remove', this.update, this);
	},
	
	//
	// rendering methods
	//

	update: function() {
		if (this.collection.length == 0) {
			this.$el.addClass('empty');
		} else {
			this.$el.removeClass('empty');
		}
	},

	//
	// drag and drop event handling methods
	//

	onDropOn: function(items) {

		// expand sub tree
		//
		this.unhighlight();
		this.expand();

		// perform callback
		//
		if (this.options.ondropon) {
			this.options.ondropon(items, this);
		}
	}
}));
