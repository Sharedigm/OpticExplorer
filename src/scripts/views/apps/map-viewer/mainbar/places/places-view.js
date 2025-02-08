/******************************************************************************\
|                                                                              |
|                                places-view.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying map places.                   |
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
import ContainableMappable from '../../../../../views/apps/map-viewer/mainbar/maps/behaviors/containable-mappable.js';
import PlaceIconsView from '../../../../../views/apps/map-viewer/mainbar/places/icons/place-icons-view.js';
import PlaceListView from '../../../../../views/apps/map-viewer/mainbar/places/lists/place-list-view.js';
import PlaceTilesView from '../../../../../views/apps/map-viewer/mainbar/places/tiles/place-tiles-view.js';
import PlaceCardsView from '../../../../../views/apps/map-viewer/mainbar/places/cards/place-cards-view.js';

export default ItemsView.extend(_.extend({}, ContainableMappable, {

	//
	// iterator
	//

	placeOn: function(mapView) {
		let children = this.getChildView('items').children;
		for (let i = 0; i < children.length; i++) {
			children.findByIndex(i).placeOn(mapView);
		}
	},

	updatePlaces: function(mapView) {
		let children = this.getChildView('items').children;
		for (let i = 0; i < children.length; i++) {
			children.findByIndex(i).updatePlace(mapView);
		}
	},

	//
	// rendering methods
	//

	showIcons: function() {

		// show project icons
		//
		this.showChildView('items', new PlaceIconsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showLists: function(inline) {

		// show project list
		//
		this.showChildView('items', new PlaceListView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			inline: inline
		})));
	},

	showTiles: function() {
		
		// show tile grid
		//
		this.showChildView('items', new PlaceTilesView(_.extend({}, this.options, {
			collection: this.collection
		})));
	},

	showCards: function() {
		
		// show card grid
		//
		this.showChildView('items', new PlaceCardsView(_.extend({}, this.options, {
			collection: this.collection
		})));
	}
}));