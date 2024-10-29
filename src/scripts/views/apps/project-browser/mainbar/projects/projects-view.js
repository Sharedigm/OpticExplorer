/******************************************************************************\
|                                                                              |
|                               projects-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying task projects.                |
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
import ProjectIconsView from '../../../../../views/apps/project-browser/mainbar/projects/icons/project-icons-view.js';
import ProjectListView from '../../../../../views/apps/project-browser/mainbar/projects/lists/project-list-view.js';
import ProjectTilesView from '../../../../../views/apps/project-browser/mainbar/projects/tiles/project-tiles-view.js';
import ProjectCardsView from '../../../../../views/apps/project-browser/mainbar/projects/cards/project-cards-view.js';

export default ItemsView.extend({

	//
	// rendering methods
	//

	showIcons: function() {

		// show project icons
		//
		this.showChildView('items', new ProjectIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showLists: function(inline) {

		// show project list
		//
		this.showChildView('items', new ProjectListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			inline: inline
		})));
	},

	showTiles: function() {
		
		// show tile grid
		//
		this.showChildView('items', new ProjectTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showCards: function() {
		
		// show card grid
		//
		this.showChildView('items', new ProjectCardsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	}
});