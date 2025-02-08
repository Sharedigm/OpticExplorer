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
import AccountIconsView from '../../../../../views/apps/account-manager/mainbar/accounts/icons/account-icons-view.js';
import AccountListView from '../../../../../views/apps/account-manager/mainbar/accounts/lists/account-list-view.js';
import AccountTilesView from '../../../../../views/apps/account-manager/mainbar/accounts/tiles/account-tiles-view.js';
import AccountCardsView from '../../../../../views/apps/account-manager/mainbar/accounts/cards/account-cards-view.js';

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
		this.showChildView('items', new AccountIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showLists: function(inline) {

		// show user lists
		//
		this.showChildView('items', new AccountListView(_.extend({}, this.options, {
			collection: this.collection,
			inline: inline
		})));
	},

	showTiles: function() {

		// show user tiles
		//
		this.showChildView('items', new AccountTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showCards: function() {

		// show user cards
		//
		this.showChildView('items', new AccountCardsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showMap: function() {
		import(
			'../../../../../views/apps/account-manager/mainbar/accounts/maps/account-map-view.js'
		).then((AccountMapView) => {

			// show user map
			//
			this.showChildView('items', new AccountMapView.default(_.extend({}, this.options, {
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