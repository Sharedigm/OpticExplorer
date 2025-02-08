/******************************************************************************\
|                                                                              |
|                                  users-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating users.       |
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
import UserIconsView from '../../../../../views/apps/profile-browser/mainbar/users/icons/user-icons-view.js';
import UserListView from '../../../../../views/apps/profile-browser/mainbar/users/lists/user-list-view.js';
import UserTilesView from '../../../../../views/apps/profile-browser/mainbar/users/tiles/user-tiles-view.js';
import UserCardsView from '../../../../../views/apps/profile-browser/mainbar/users/cards/user-cards-view.js';

export default ItemsView.extend({

	//
	// constructor
	//

	initialize: function() {

		// set optional parameter defaults
		//
		if (this.options.add_behaviors == undefined) {
			this.options.add_behaviors = true;
		}
		if (this.options.show_controls == undefined) {
			this.options.show_controls = true;
		}
		if (this.options.onopen == undefined) {
			this.options.onopen = (item) => {

				// show user's profile info
				//
				application.showUser(item.model);
			};
		}
	},

	//
	// sorting methods
	//

	sortItemsBy: function(sortKind, sortOrder) {
		
		function reverseSortBy(sortByFunction) {
			return function(left, right) {
				let l = sortByFunction(left);
				let r = sortByFunction(right);

				if (l === void 0) return -1;
				if (r === void 0) return 1;

				return l < r ? 1 : l > r ? -1 : 0;
			};
		}

		if (!this.collection) {
			return;
		}

		// set sort kind
		//
		this.collection.comparator = function(item) {
			return item.getSortableAttribute(sortKind);
		};

		// set sort order
		//
		if (sortOrder == 'decreasing') {
			this.collection.comparator = reverseSortBy(this.collection.comparator);
		}

		this.collection.sort();
	},

	//
	// rendering methods
	//

	showIcons: function() {

		// show user icons
		//
		this.showChildView('items', new UserIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showLists: function(inline) {

		// show user lists
		//
		this.showChildView('items', new UserListView(_.extend({}, this.options, {
			collection: this.collection,
			inline: inline
		})));
	},

	showTiles: function() {

		// show user tiles
		//
		this.showChildView('items', new UserTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showCards: function() {

		// show user cards
		//
		this.showChildView('items', new UserCardsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showMap: function() {
		import(
			'../../../../../views/apps/map-viewer/mainbar/maps/users-map-view.js'
		).then((UsersMapView) => {

			// show user map
			//
			this.showChildView('items', new UsersMapView.default(_.extend({}, this.options, {
				collection: this.collection
			})));
		});
	},

	//
	// file event handling methods
	//

	onOpen: function(item) {

		// perform callback
		//
		if (this.options.onopen) {
			this.options.onopen(item);
		}
	},

	//
	// window event handling methods
	//

	onResize: function() {
		if (this.getChildView('items').onResize) {
			this.getChildView('items').onResize();
		}
	}
});