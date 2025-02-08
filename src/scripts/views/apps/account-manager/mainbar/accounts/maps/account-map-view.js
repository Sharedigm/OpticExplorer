/******************************************************************************\
|                                                                              |
|                             account-map-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view of a map of user account icons.                   |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import ItemsMapView from '../../../../../../views/apps/map-viewer/mainbar/maps/items-map-view.js';
import MappableUsersView from '../../../../../../views/apps/map-viewer/mainbar/users/mappable-users-view.js';

export default ItemsMapView.extend({

	//
	// rendering methods
	//

	getItemsLayerView: function() {
		return new MappableUsersView(_.extend({}, this.options, {
			collection: this.collection,

			// options
			//
			preferences: this.options.preferences,
			view_kind: this.options.preferences.get('map_view_kind'),
			tile_size: this.options.tile_size,

			// state
			//
			selected: this.options.selected,

			// filter options
			//
			viewFilter: (view) => view.model.hasGeolocation && view.model.hasGeolocation(),
			
			// callbacks
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items),
			onadd: (item) => this.placeIcon(item)
		}));
	}
});