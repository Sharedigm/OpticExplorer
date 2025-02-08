/******************************************************************************\
|                                                                              |
|                               tab-pane-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying code tabs.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../../../../models/places/place.js';
import MapFile from '../../../../../../models/storage/files/map-file.js';
import Places from '../../../../../../collections/places/places.js';
import Items from '../../../../../../collections/storage/items.js';
import Connections from '../../../../../../collections/connections/connections.js';
import MapView from '../../../../../../views/apps/map-viewer/mainbar/maps/map-view.js';
import EditableTabPaneView from '../../../../../../views/apps/common/mainbar/tabbed-content/editable-tab-panes/editable-tab-pane-view.js';
import WeatherMapView from '../../../../../../views/apps/map-viewer/mainbar/maps/weather-map-view.js';
import FullScreenable from '../../../../../../views/behaviors/layout/full-screenable.js';

export default EditableTabPaneView.extend(_.extend({}, FullScreenable, {

	//
	// attributes
	//

	min_zoom: 1,
	max_zoom: 10,

	//
	// map attributes
	//

	layers: ['favorites', 'places', 'photos', 'videos', 'people'],

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		if (!this.model) {
			this.model = new MapFile();
		}
		if (this.options.place) {
			this.place = this.options.place;
		}
		this.map_mode = this.options.map_mode;
		this.currentPlace = this.options.currentPlace;

		// set collection attributes
		//
		this.items = this.options.items? new Items(this.options.items) : undefined;
		this.photos = this.options.photos? new Items(this.options.photos) : new Items();
		this.videos = this.options.videos? new Items(this.options.videos) : new Items();
		this.overlays = this.options.overlays? new Items(this.options.overlays) : new Items();
		this.people = this.options.people? new Connections(this.options.people) : new Connections();
		this.places = this.options.places? new Places(this.options.places) : new Places();
		this.favorites = this.options.favorites? this.options.favorites : new Places();

		// find place from items
		//
		if (!this.place) {
			this.place = this.getDefaultPlace();
		}
	},

	//
	// converting methods
	//

	toKML: function() {
		return this.model.toKML(this.getCurrentPlace(), {

			// collections
			//
			photos: this.photos,
			videos: this.videos,
			overlays: this.overlays,
			places: this.places
		});
	},

	//
	// querying methods
	//

	hasChanged: function() {
		return !this.model.isNew() && this.changed;
	},

	hasItems: function(kind) {
		switch (kind) {
			case 'photos':
				return this.photos.length > 0;
			case 'videos':
				return this.videos.length > 0;
			case 'overlays':
				return this.overlays.length > 0;
			case 'places':
				return this.places.length > 0;
			case 'favorites':
				return this.favorites.length > 0;
			case 'people':
				return this.people.length > 0;
		}
	},

	hasLayerView: function(layer) {
		if (this.hasChildView('content')) {
			return this.getChildView('content').hasLayerView(layer);
		}
	},

	hasSelected: function(layers) {

		// set optional parameter defaults
		//
		if (!layers) {
			layers = this.layers;
		}

		// search layers for selected
		//
		for (let i = 0; i < layers.length; i++) {
			if (this.hasSelectedLayerItems(layers[i])) {
				return true;
			}	
		}

		return false;
	},

	hasSelectedItems: function(kind) {
		return this.hasSelectedLayerItems(kind);
	},

	hasSelectedLayerItems: function(layer) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).hasSelected();
		}
	},

	//
	// counting methods
	//

	numSelectedLayerItems: function(layer) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).numSelected();
		}
	},

	//
	// getting methods
	//

	getLatitude: function() {
		if (this.hasLayerView('map')) {
			return this.getLayerView('map').getLatitude();
		}
	},

	getLongitude: function() {
		if (this.hasLayerView('map')) {
			return this.getLayerView('map').getLongitude();
		}
	},

	getLatLon: function() {
		if (this.hasLayerView('map')) {
			return this.getLayerView('map').getLatLon();
		}
	},

	getMapMode: function() {
		if (this.hasLayerView('map')) {
			return this.getLayerView('map').getMapMode();
		}
	},

	getAeroMode: function() {
		if (this.hasLayerView('map')) {
			return this.getLayerView('map').getAeroMode();
		}
	},

	getOffset: function() {
		if (this.hasLayerView('map')) {
			return this.getLayerView('map').offset;
		}
	},

	getZoomLevel: function() {
		if (this.hasLayerView('map')) {
			return this.getLayerView('map').getZoomLevel();
		}
	},

	getItemView: function(model) {
		if (this.hasChildView('content')) {
			return this.getChildView('content').getItemView(model);
		}
	},

	//
	// layer getting methods
	//

	getLayerView: function(layer) {
		if (this.hasChildView('content')) {
			return this.getChildView('content').getLayerView(layer);
		}
	},

	getLayerItemView: function(layer, model) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).getItemView(model);
		}
	},

	getSelectedLayerItems: function(layer) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).getSelected();
		}
	},

	getSelectedLayerModels: function(layer) {
		if (this.hasLayerView(layer)) {
			return this.getLayerView(layer).getSelectedModels();
		}
	},

	//
	// selection getting methods
	//

	getSelectedItem: function(layers) {
		let item;
		let index = 0;

		// set optional parameter defaults
		//
		if (!layers) {
			layers = this.layers;
		}

		while (!item && index < layers.length) {
			let layer = layers[index];
			if (this.hasSelectedLayerItems(layer)) {
				item = this.getSelectedLayerModels(layer)[0];
			} else {
				index++;
			}
		}
		return item;
	},

	getSelectedModels: function(layers) {
		let models = [];

		// set optional parameter defaults
		//
		if (!layers) {
			layers = this.layers;
		}
		
		for (let i = 0; i < layers.length; i++) {
			let layer = layers[i];
			if (this.hasSelectedLayerItems(layer)) {
				let selected = this.getSelectedLayerModels(layer);
				for (let j = 0; j < selected.length; j++) {
					models.push(selected[j]);
				}
			}
		}
		return models;		
	},

	//
	// place getting methods
	//

	getCurrentPlace: function() {
		let latLon = this.getLatLon();
		return new Place({
			latitude: latLon.latitude,
			longitude: latLon.longitude,
			zoom_level: this.getZoomLevel()
		});
	},

	getDefaultPlace: function() {

		// get place from photos
		//
		if (this.options.photos && this.photos.hasGeolocation()) {
			return new Place(_.extend(this.photos.getLatLon(), {
				zoom_level: this.photos.getZoomLevel() || this.default_zoom_level
			}));

		// get place from videos
		//
		} else if (this.options.videos && this.videos.hasGeolocation()) {
			return new Place(_.extend(this.videos.getLatLon(), {
				zoom_level: this.videos.getZoomLevel() || this.default_zoom_level
			}));

		// get place from people
		//
		} else if (this.options.people && this.people.hasGeolocation()) {
			return new Place(_.extend(this.people.getLatLon(), {
				zoom_level: this.people.getZoomLevel() || this.default_zoom_level
			}));

		// get place from items
		//
		} else if (this.options.items && this.items.hasGeolocation()) {
			return new Place(_.extend(this.items.getLatLon(), {
				zoom_level: this.items.getZoomLevel() || this.default_zoom_level
			}));

		// get place from preferences
		//
		} else {
			return new Place({
				latitude: this.options.preferences.get('latitude'),
				longitude: this.options.preferences.get('longitude'),
				zoom_level: this.options.preferences.get('zoom_level')
			});
		}
	},

	getPlaceMap: function(place) {
		return MapView.getMap({
			latitude: place.get('latitude'),
			longitude: place.get('longitude'),
			zoom_level: Math.clamp(place.get('zoom_level'), this.min_zoom, this.max_zoom),
			mode: this.map_mode || this.options.preferences.get('map_mode'),
			aero_mode: this.aero_mode || this.options.preferences.get('aero_mode')
		});
	},

	getSelectedPlaces: function() {
		return this.getSelectedLayerModels('places');
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		if (this.hasChildView('content')) {
			this.getChildView('content').setOption(key, value);
		}
	},

	setMapMode: function(mapMode) {
		this.map_mode = mapMode;
		this.setOption('map_mode', mapMode);
	},

	setActive: function(active) {

		// call superclass method
		//
		EditableTabPaneView.prototype.setActive.call(this, active);

		// show map
		//
		if (active) {
			this.showContent();

			// perform callback
			//
			if (this.options.onactivate) {
				this.options.onactivate();
			}
		} else if (this.hasChildView('content')) {
			this.currentPlace = this.getCurrentPlace();
			this.map = this.getPlaceMap(this.currentPlace);

			// destroy child view
			//
			this.getChildView('content').destroy();
		}

		// changing tabs can change the map size due
		// to different toolbar configurations
		//
		this.onResize();

		// update view
		//
		if (active) {
			this.onActivate();
		}
	},

	setShowCrosshairs: function(value) {
		if (value) {
			if (this.$el.find('.controls.layer .crosshairs').length == 0) {
				this.$el.find('.controls.layer').append($('<div class="crosshairs">' +
					'<img src="images/icons/binary/crosshair-icon.svg" />' +
					'</div>'));
			}
		} else {
			this.$el.find('.controls.layer .crosshairs').remove();
		}
	},

	setLayersVisible: function(layers) {
		this.getChildView('content').setLayersVisible(layers);
	},

	setItemsSelected: function(selected, filter, options) {
		this.getChildView('content').setItemsSelected(selected, filter, options);
	},

	//
	// selecting methods
	//

	selectAll: function(filter) {
		this.getChildView('content').selectAll(filter);
	},

	selectInvert: function(filter) {
		this.getChildView('content').selectInvert(filter);
	},

	selectLayer: function(layer, filter) {
		this.getChildView('content').selectLayer(layer, filter);
	},

	deselectAll: function(filter) {
		this.getChildView('content').deselectAll(filter);
	},

	//
	// full screen methods
	//

	requestFullScreen: function() {
		let self = this;
		window.addEventListener('fullscreenchange', function(event) {

			// perform callback after a slight delay for repainting
			//
			window.setTimeout(() => {
				self.onFullScreenChange(event);
			}, 100);

			window.removeEventListener('fullscreenchange', this);
		});
		FullScreenable.requestFullScreen.call(this);
	},

	exifFullScreen: function() {
		FullScreenable.exitFullScreen.call(this);
		this.onResize();
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// load tab pane contents
		//
		this.loadFile(this.model);
	},

	showContent: function() {
		let mapLayers = this.options.preferences.get('map_layers') || [];

		// show tab content
		//
		this.showChildView('content', this.getContentView());

		// set annotation styles
		//
		// this.getChildView('content').setArrowStyle(this.options.preferences.get('arrow_style'));
		// this.getChildView('content').setLabelStyle(this.options.preferences.get('label_style'));

		// add / remove crosshairs
		//
		if (mapLayers.includes('crosshairs')) {
			this.setShowCrosshairs(true);	
		}
	},
	
	getContentView: function() {
		return new WeatherMapView({
			collection: this.items,

			// options
			//
			map: this.getPlaceMap(this.currentPlace || this.place),
			// place: this.currentPlace || this.place,
			droppable: true,
			uploadable: true,
			uploadsDirectory: this.uploadsDirectory,

			// collections
			//
			photos: this.photos,
			videos: this.videos,
			overlays: this.overlays,
			people: this.people,
			places: this.places,
			favorites: this.favorites,

			// preferences
			//
			preferences: this.options.preferences,
			show_grid: this.options.preferences.get('show_grid'),
			show_smoothing: this.options.preferences.get('show_smoothing'),
			map_layers: this.options.preferences.get('map_layers') || [],
			weather_layers: this.options.preferences.get('weather_layers') || [],
			view_kind: this.options.preferences.get('view_kind'),
			show_item_names: this.options.preferences.get('show_item_names'),
			show_geo_orientations: this.options.preferences.get('show_geo_orientations'),
			label_style: 'diagonal',

			// callbacks
			//
			onchange: this.options.onchange,
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect,
			onopen: this.options.onopen,
			ondropin: this.options.ondropin
		});
	},

	//
	// loading methods
	//

	loadFile: function(model, options) {

		// set attributes
		//
		if (model) {
			this.model = model;
		}

		// read text file contents
		//
		if (!this.model.isNew()) {
			this.model.read({

				// callbacks
				//
				success: (data) => {

					// parse KML data
					//
					this.place = this.model.parseKML(data, {

						// collections
						//
						photos: this.photos,
						videos: this.videos,
						overlays: this.overlays,
						places: this.places,

						// callbacks
						//
						onload: () => {
							this.onLoad();
						}
					});

					// if no attachments, then loaded
					//
					if (this.photos.length == 0 &&
						this.videos.length == 0) {
						this.onLoad();
					}

					// perform callback
					//
					if (options && options.success) {
						options.success(data);
					}
				},

				error: (model, response) => {

					// show error message
					//
					application.error({
						message: "Could not read text file.",
						response: response
					});
				}
			});
		} else {
			this.onLoad();
		}
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// set initial state
		//
		if (!this.isActive()) {
			if (this.collection.indexOf(this.model) == this.collection.length - 1) {
				this.setActive(this);
			}
		}

		// update view
		//
		// this.getChildView('content').onLoad();
		this.loaded = true;

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	onActivate: function() {
		if (this.hasChildView('content')) {
			this.getChildView('content').onActivate(event);
		}
	},

	//
	// window event handling methods
	//

	onResize: function(event) {
		if (this.hasChildView('content')) {
			this.getChildView('content').onResize(event);
		}
	},

	onFullScreenChange: function() {
		this.onResize();
		if (this.hasChildView('content')) {
			this.getChildView('content map').updateTiles();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.photos.reset();
		this.videos.reset();
		this.people.reset();
		this.places.reset();
	}
}));