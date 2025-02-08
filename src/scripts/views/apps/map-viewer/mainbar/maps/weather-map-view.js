/******************************************************************************\
|                                                                              |
|                             weather-map-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying weather maps.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Items from '../../../../../collections/storage/items.js';
import ItemsMapView from '../../../../../views/apps/map-viewer/mainbar/maps/items-map-view.js';
import AnnotatedViewportView from '../../../../../views/svg/annotation/annotated-viewport-view.js';
import MappableFilesView from '../../../../../views/apps/map-viewer/mainbar/files/mappable-files-view.js';
import MappableUsersView from '../../../../../views/apps/map-viewer/mainbar/users/mappable-users-view.js';
import WeatherLayersView from '../../../../../views/apps/map-viewer/mainbar/layers/weather-layers-view.js';
import PlacesView from '../../../../../views/apps/map-viewer/mainbar/places/places-view.js';

export default ItemsMapView.extend({

	//
	// attributes
	//

	layers: ['map', 'items', 'weather', 'photos', 'videos', 'people', 'places', 'favorites', 'annotations', 'controls'],

	//
	// constructor
	//

	initialize: function() {

		// call superclass constructor
		//
		ItemsMapView.prototype.initialize.call(this);

		// set optional parameter defaults
		//
		if (!this.options.map_layers) {
			this.options.map_layers = ['items', 'photos', 'videos', 'places', 'annotations'];
		}

		// set initial layer visibility
		//
		this.visibility = {
			map: true,
			items: this.collection && this.collection.length > 0,
			weather: this.options.map_layers.includes('weather'),
			photos: this.options.map_layers.includes('photos'),
			videos: this.options.map_layers.includes('videos'),
			people: this.options.map_layers.includes('people'),
			places: this.options.map_layers.includes('places'),
			favorites: this.options.map_layers.includes('favorites'),
			annotations: this.options.map_layers.includes('annotations')
		};
	},

	//
	// querying methods
	//

	hasPhotos: function() {
		return this.options.photos && this.options.photos.length > 0;
	},

	hasVideos: function() {
		return this.options.videos && this.options.videos.length > 0;
	},

	hasPeople: function() {
		return this.options.people && this.options.people.length > 0;
	},

	hasPlaces: function() {
		return this.options.places && this.options.places.length > 0;
	},

	hasFavorites: function() {
		return this.options.favorites && this.options.favorites.length > 0;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		ItemsMapView.prototype.onRender.call(this);

		// hide icon names, geoorientations
		//
		if (!this.options.show_item_names) {
			this.$el.addClass('hide-item-names');
		}
		if (!this.options.show_geo_orientations) {
			this.$el.addClass('hide-geo-orientations');
		}

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'button'
		});
	},

	getNewLayerView: function(layer) {
		switch (layer) {
			case 'map':
				return this.getMapLayerView();
			case 'items':
				return this.getItemsLayerView();
			case 'weather':
				return this.getWeatherLayerView();
			case 'photos':
				return this.getPhotosLayerView();
			case 'videos':
				return this.getVideosLayerView();
			case 'people':
				return this.getPeopleLayerView();
			case 'places':
				return this.getPlacesLayerView();
			case 'favorites':
				return this.getFavoritesLayerView();
			case 'annotations':
				return this.getAnnotationsLayerView();
		}
	},

	getItemsLayerView: function() {
		return new MappableFilesView({
			collection: this.collection || new Items(),

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

			// event handlers
			//
			onselect: (item) => this.onSelect(item),
			ondeselect: (item) => this.onDeselect(item),
			onopen: (item) => this.onOpen(item),
			ondropout: (items) => this.onDropOut(items),
			onadd: () => this.placeOn(this.getChildView('map'))
		});
	},

	getWeatherLayerView: function() {
		return new WeatherLayersView({
			latitude: this.map.latitude,
			longitude: this.map.longitude,
			zoom_level: this.getZoomLevel(),
			layers: this.options.weather_layers
		});
	},

	getPhotosLayerView: function() {
		return new MappableFilesView({
			collection: this.options.photos,

			// options
			//
			view_kind: this.options.view_kind,
			tile_size: this.options.tile_size,

			// callbacks
			//
			onadd: (item) => this.onAdd(item),
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		});
	},

	getVideosLayerView: function() {
		return new MappableFilesView({
			collection: this.options.videos,

			// options
			//
			view_kind: this.options.view_kind,
			tile_size: this.options.tile_size,

			// callbacks
			//
			onadd: (item) => this.onAdd(item),
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		});
	},

	getPeopleLayerView: function() {
		return new MappableUsersView({
			collection: this.options.people,

			// options
			//
			view_kind: this.options.view_kind,
			tile_size: this.options.tile_size,

			// callbacks
			//
			onadd: (item) => this.onAdd(item),
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		});
	},

	getPlacesLayerView: function() {
		return new PlacesView({
			collection: this.options.places,

			// options
			//
			view_kind: this.options.view_kind,
			tile_size: this.options.tile_size,
			inline: true,

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: false,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		});
	},

	getFavoritesLayerView: function() {
		return new PlacesView({
			collection: this.options.favorites,

			// options
			//
			view_kind: this.options.view_kind,
			tile_size: this.options.tile_size,
			inline: true,

			// capabilities
			//
			selectable: true,
			editable: false,
			draggable: false,
			droppable: false,

			// callbacks
			//
			onload: this.options.onload,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen
		});
	},

	getAnnotationsLayerView: function() {
		return new AnnotatedViewportView();
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {

		// update items on map
		//
		this.placeMarkers();
		if (this.hasChildView('weather')) {
			this.getLayerView('weather').onChange(attribute);
		}

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	}
});