/******************************************************************************\
|                                                                              |
|                                groups-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating groups.      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemsView from '../../../../../views/items/items-view.js';
import GroupIconsView from '../../../../../views/apps/connection-manager/sidebar/groups/icons/group-icons-view.js';
import GroupListView from '../../../../../views/apps/connection-manager/sidebar/groups/lists/group-list-view.js';
import GroupTreeListView from '../../../../../views/apps/connection-manager/sidebar/groups/trees/group-tree-list-view.js';
import GroupTilesView from '../../../../../views/apps/connection-manager/sidebar/groups/tiles/group-tiles-view.js';
import GroupCardsView from '../../../../../views/apps/connection-manager/sidebar/groups/cards/group-cards-view.js';

export default ItemsView.extend({

	//
	// rendering methods
	//

	showIcons: function() {
		this.showChildView('items', new GroupIconsView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showLists: function() {
		this.showChildView('items', new GroupListView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showTrees: function() {
		this.showChildView('items', new GroupTreeListView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showTiles: function() {
		this.showChildView('items', new GroupTilesView(_.extend({
			collection: this.collection
		}, this.options)));
	},

	showCards: function() {
		this.showChildView('items', new GroupCardsView(_.extend({
			collection: this.collection
		}, this.options)));
	}
});