/******************************************************************************\
|                                                                              |
|                                 topics-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying news topics.                  |
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
import TopicIconsView from '../../../../../views/apps/topic-browser/mainbar/topics/icons/topic-icons-view.js';
import TopicListView from '../../../../../views/apps/topic-browser/mainbar/topics/lists/topic-list-view.js';
import TopicTilesView from '../../../../../views/apps/topic-browser/mainbar/topics/tiles/topic-tiles-view.js';
import TopicCardsView from '../../../../../views/apps/topic-browser/mainbar/topics/cards/topic-cards-view.js';

export default ItemsView.extend({

	//
	// rendering methods
	//

	showIcons: function() {

		// show topic icons
		//
		this.showChildView('items', new TopicIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showLists: function(inline) {

		// show topic list
		//
		this.showChildView('items', new TopicListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			inline: inline
		})));
	},

	showTiles: function() {
		
		// show tile grid
		//
		this.showChildView('items', new TopicTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showCards: function() {
		
		// show card grid
		//
		this.showChildView('items', new TopicCardsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	}
});