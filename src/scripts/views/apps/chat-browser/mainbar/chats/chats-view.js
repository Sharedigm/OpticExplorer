/******************************************************************************\
|                                                                              |
|                                chats-view.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying a collection of chats.        |
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
import ChatIconsView from '../../../../../views/apps/chat-browser/mainbar/chats/icons/chat-icons-view.js';
import ChatListView from '../../../../../views/apps/chat-browser/mainbar/chats/lists/chat-list-view.js';
import ChatCardsView from '../../../../../views/apps/chat-browser/mainbar/chats/cards/chat-cards-view.js';
import ChatTilesView from '../../../../../views/apps/chat-browser/mainbar/chats/tiles/chat-tiles-view.js';

export default ItemsView.extend({

	//
	// rendering methods
	//

	showIcons: function() {

		// show chat icons
		//
		this.showChildView('items', new ChatIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showLists: function(inline) {

		// show chat list
		//
		this.showChildView('items', new ChatListView(_.extend({}, this.options, {
			collection: this.collection,
			inline: inline
		})));
	},

	showCards: function() {

		// show chat cards
		//
		this.showChildView('items', new ChatCardsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showTiles: function() {

		// show chat tiles
		//
		this.showChildView('items', new ChatTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	}
});