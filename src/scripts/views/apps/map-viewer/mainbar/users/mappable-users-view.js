/******************************************************************************\
|                                                                              |
|                            mappable-users-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying mappable users.               |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UsersView from '../../../../../views/apps/profile-browser/mainbar/users/users-view.js';
import MappableUserIconsView from '../../../../../views/apps/map-viewer/mainbar/users/icons/mappable-user-icons-view.js';
import MappableUserListView from '../../../../../views/apps/map-viewer/mainbar/users/lists/mappable-user-list-view.js';
import MappableUserTilesView from '../../../../../views/apps/map-viewer/mainbar/users/tiles/mappable-user-tiles-view.js';
import MappableUserCardsView from '../../../../../views/apps/map-viewer/mainbar/users/cards/mappable-user-cards-view.js';
import UsersMapView from '../../../../../views/apps/map-viewer/mainbar/maps/users-map-view.js';

export default UsersView.extend({

	//
	// geolocating methods
	//

	placeOn: function(mapView) {
		if (this.hasChildView('items')) {
			let children = this.getChildView('items').children;
			for (let i = 0; i < children.length; i++) {
				children.findByIndex(i).placeOn(mapView);
			}
		}
	},

	updatePlaces: function(mapView) {
		if (this.hasChildView('items')) {
			let children = this.getChildView('items').children;
			for (let i = 0; i < children.length; i++) {
				children.findByIndex(i).updatePlace(mapView);
			}
		}
	},

	//
	// rendering methods
	//

	showIcons: function() {

		// show directory icons
		//
		this.showChildView('items', new MappableUserIconsView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showLists: function(inline) {

		// show directory lists
		//
		this.showChildView('items', new MappableUserListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			inline: inline,
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showTiles: function() {

		// show directory tiles
		//
		this.showChildView('items', new MappableUserTilesView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,
			tile_size: this.options.preferences? this.options.preferences.get('tile_size') : undefined,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showCards: function() {

		// show directory cards
		//
		this.showChildView('items', new MappableUserCardsView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	},

	showMap: function() {

		// show directory map
		//
		this.showChildView('items', new UsersMapView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			filter: this.options.filter || this.filter,
			max_size: 512,

			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items)
		})));
	}
});