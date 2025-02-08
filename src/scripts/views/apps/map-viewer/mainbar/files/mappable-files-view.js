/******************************************************************************\
|                                                                              |
|                                  files-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying and manipulating files.       |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import FilesView from '../../../../../views/apps/file-browser/mainbar/files/files-view.js';
import MappableDirectoryIconsView from '../../../../../views/apps/map-viewer/mainbar/files/icons/mappable-directory-icons-view.js';
import MappableDirectoryListView from '../../../../../views/apps/map-viewer/mainbar/files/lists/mappable-directory-list-view.js';
import MappableDirectoryTilesView from '../../../../../views/apps/map-viewer/mainbar/files/tiles/mappable-directory-tiles-view.js';
import MappableDirectoryCardsView from '../../../../../views/apps/map-viewer/mainbar/files/cards/mappable-directory-cards-view.js';
import DirectoryMapView from '../../../../../views/apps/map-viewer/mainbar/maps/directory-map-view.js';

export default FilesView.extend({

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
		this.showChildView('items', new MappableDirectoryIconsView(_.extend({}, this.options, {
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
		this.showChildView('items', new MappableDirectoryListView(_.extend({}, this.options, {
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
		this.showChildView('items', new MappableDirectoryTilesView(_.extend({}, this.options, {
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
		this.showChildView('items', new MappableDirectoryCardsView(_.extend({}, this.options, {
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
		this.showChildView('items', new DirectoryMapView(_.extend({}, this.options, {
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