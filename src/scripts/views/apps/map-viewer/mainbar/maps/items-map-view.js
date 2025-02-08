/******************************************************************************\
|                                                                              |
|                               items-map-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a base view of a set of items on a map.                  |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MultiLayerMapView from '../../../../../views/apps/map-viewer/mainbar/maps/multilayer-map-view.js';
import SelectableContainable from '../../../../../views/behaviors/containers/selectable-containable.js';
import MapView from '../../../../../views/apps/map-viewer/mainbar/maps/map-view.js';
import MapOverlayView from '../../../../../views/apps/map-viewer/mainbar/maps/markers/map-overlay-view.js';

export default MultiLayerMapView.extend(_.extend({}, SelectableContainable, {

	//
	// attributes
	//

	className: 'items-map',
	layers: ['map', 'items', 'controls'],

	events: {
		'mousedown .map': 'onMouseDown',
		'click .map-viewer': 'onClickMapViewer',
		'tap .map': 'onClick',
	},

	//
	// constructor
	//

	initialize: function() {
		let preferences = this.options.preferences || this.preferences;

		// set optional parameter defaults
		//
		if (!this.options.view_kind) {
			this.options.view_kind = preferences.get('map_view_kind');
		}
		if (!this.options.tile_size) {
			this.options.tile_size = 'small';
		}

		// set attributes
		//
		this.map = this.options.map;
		if (this.map === undefined && this.options.place) {
			this.map = this.getPlaceMap(this.options.place, preferences.get('map_mode'));
		}
		if (this.map === undefined && this.collection) {
			this.map = this.getItemsMap(this.collection, preferences.get('map_mode'));
		}
		if (this.map === undefined) {
			this.map = this.getDefaultMap(preferences);
		}

		// listen for changes to overlays
		//
		this.listenTo(this.options.overlays, 'add', (item) => {
			this.addOverlay(item);
		});
		this.listenTo(this.options.overlays, 'remove', (item) => {
			this.removeOverlay(item);
		})
	},

	//
	// getting methods
	//

	getLayerItemView: function(layer, model) {
		if (this.hasLayerView(layer) &&
			this.getLayerView(layer).getItemView) {
			return this.getLayerView(layer).getItemView(model);
		}
	},

	getItemView: function(model) {
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			let view = this.getLayerItemView(layers[i], model);
			if (view) {
				return view;
			}
		}
	},

	getViewKind: function() {
		if (this.options.view_kind) {
			return this.options.view_kind;
		} else if (this.options.preferences) {
			return this.options.preferences.get('view_kind');
		}
	},

	getNewLayerView: function(kind) {
		switch (kind) {
			case 'map':
				return this.getMapLayerView();
			case 'items':
				return this.getItemsLayerView({
					view_kind: this.getViewKind(),
					tile_size: 'small'
				});
		}
	},

	//
	// map getting methods
	//

	getPlaceMap: function(place, mapMode) {
		return MapView.getMap({
			latitude: place.get('latitude'),
			longitude: place.get('longitude'),
			zoom_level: place.get('zoom_level') || this.default_zoom_level,
			mode: mapMode
		});
	},

	getItemsMap: function(collection, mapMode) {
		let latLon = collection.getLatLon();
		let zoomLevel = collection.getZoomLevel();

		if (latLon) {
			return MapView.getMap({
				latitude: latLon.latitude,
				longitude: latLon.longitude,
				zoom_level: zoomLevel || this.default_zoom_level,
				mode: mapMode
			});
		}
	},

	getGeopositionedItems: function() {
		let items = [];
		if (this.collection) {
			for (let i = 0; i < this.collection.length; i++) {
				let item = this.collection.at(i);
				if (item.hasGeoposition && item.hasGeoposition()) {
					items.push(item);
				}
			}
		}
		return items;
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'map_mode':
				this.setMapMode(value);
				break;
			case 'show_item_names':
				this.setShowItemNames(value);
				break;
			case 'show_geo_orientations':
				this.setShowGeoOrientations(value);
				break;
			case 'map_view_kind':
				this.setLayersOption('view_kind', value);
				this.placeOn(this.getChildView('map'));
				this.placeMarkers();
				break;
			default:
				this.setLayersOption(key, value);
				break;
		}
	},

	setShowItemNames: function(value) {
		if (value) {
			this.$el.removeClass('hide-item-names');
		} else {
			this.$el.addClass('hide-item-names');
		}
	},

	setShowGeoOrientations: function(value) {
		if (value) {
			this.$el.removeClass('hide-geo-orientations');
		} else {
			this.$el.addClass('hide-geo-orientations');
		}
	},

	setLayersVisible: function(layers) {

		// call superclass method
		//
		MultiLayerMapView.prototype.setLayersVisible.call(this, layers);

		// hide / show overlays
		//
		let visible = layers.length > 0? layers.includes('crosshairs') : layers;
		this.getChildView('map').setLayerVisibility('overlay', visible);
	},

	//
	// iterator
	//

	each: function(callback, filter) {

		// select all map items
		//
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			let layer = layers[i];
			if (layer != 'controls') {
				let layerView = this.getLayerView(layer);
				if (layerView && layerView.each) {
					layerView.each(callback, filter);
				}
			}
		}
	},

	//
	// selecting methods
	//

	selectAll: function(filter) {

		// select all map items
		//
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			this.selectLayer(layers[i], filter);
		}
	},

	selectInvert: function(filter) {

		// select all map items
		//
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			this.selectInvertLayer(layers[i], filter);
		}
	},

	deselectAll: function(filter) {

		// deselect all map items
		//
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			this.deselectLayer(layers[i], filter);
		}
	},

	//
	// layer selecting methods
	//

	eachLayer: function(layer, callback, filter) {
		let layerView = this.getLayerView(layer);
		if (layerView && layerView.each) {
			layerView.each(callback, filter);
		}
	},

	selectLayer: function(layer, filter) {

		// select all on layer
		//
		let layerView = this.getLayerView(layer);
		if (layerView && layerView.selectAll) {
			layerView.selectAll(filter);
		}
	},

	selectInvertLayer: function(layer, filter) {

		// select all on layer
		//
		let layerView = this.getLayerView(layer);
		if (layerView && layerView.selectInvert) {
			layerView.selectInvert(filter);
		}
	},

	deselectLayer: function(layer, filter) {

		// select all on layer
		//
		let layerView = this.getLayerView(layer);
		if (layerView && layerView.deselectAll) {
			layerView.deselectAll(filter);
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// call superclass method
		//
		MultiLayerMapView.prototype.onAttach.call(this);

		// add map overlays
		//
		let overlays = this.getGeopositionedItems();
		this.addOverlays(overlays);

		// place items
		//
		this.placeOn(this.getLayerView('map'));
	},

	//
	// overlay rendering methods
	//

	addOverlay: function(item) {
		let mapView = this.getChildView('map');
		let selected = this.options.selected? this.options.selected.includes(item) : false;

		// add overlay view to map viewport
		//
		mapView.show(new MapOverlayView({
			model: item,

			// options
			//
			selected: selected,
			max_size: this.options.max_size,

			// callbacks
			//
			onselect: this.options.onselect,
			ondeselect: this.options.ondeselect
		}));
	},

	addOverlays: function(overlays) {
		for (let i = 0; i < overlays.length; i++) {
			this.addOverlay(overlays[i]);
		}
	},

	removeOverlays: function(overlays) {
		for (let i = 0; i < overlays.length; i++) {
			this.removeOverlay(overlays[i]);
		}
	},

	removeOverlay: function(overlay) {
		let mapView = this.getChildView('map');
		let overlayView = this.getItemView(overlay);
		if (overlayView) {
			mapView.removeChildView(overlayView);
		}
	},

	//
	// dialog rendering methods
	//

	showMapViewer: function() {
		application.launch('map_viewer', {
			place: this.getPlace()
		});
	},

	//
	// marker placing methods
	//

	setLayerVisibility: function(layer, visible) {

		// call superclass method
		//
		MultiLayerMapView.prototype.setLayerVisibility.call(this, layer, visible);

		// hide / show overlays
		//
		if (layer == 'overlays') {
			this.getChildView('map').setLayerVisibility('overlay', visible);
		}
		
		// place layer markers
		//
		if (visible) {
			this.placeLayerMarkers(layer);
		}
	},

	placeLayerMarkers: function(layer) {
		let mapView = this.getLayerView('map');
		let layerView = this.getLayerView(layer);
		if (layerView && layerView.placeOn) {
			layerView.placeOn(mapView);
		}	
	},

	placeMarkers: function() {
		let mapView = this.getLayerView('map');
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			this.placeLayerMarkers(layers[i], mapView);
		}
	},

	//
	// marker updating methods
	//

	updateLayer: function(layer) {
		let layerView = this.getLayerView(layer);
		if (layerView) {
			if (layerView.updatePlaces) {
				layerView.updatePlaces(this.getLayerView('map'));
			}
		}
	},

	updateLayers: function() {
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			this.updateLayer(layers[i]);
		}
	},

	//
	// event handling methods
	//

	onAdd: function(item) {

		// update item on map
		//
		if (item.hasGeolocation && item.hasGeolocation()) {
			item.placeOn(this.getLayerView('map'));
		} else if (item.hasGeoposition && item.hasGeoposition()) {
			this.addOverlay(item);
		}
	},

	onChange: function(attribute) {

		// update items on map
		//
		this.placeMarkers();

		// perform callback
		//
		if (this.options.onchange) {
			this.options.onchange(attribute);
		}
	},

	onActivate: function() {
		if (!this.options.overlays) {
			return;
		}
		for (let i = 0; i < this.options.overlays.length; i++) {
			this.addOverlay(this.options.overlays.at(i));
		}
	},

	//
	// mouse event handling methods
	//

	onMouseDown: function(event) {
		if (!event.shiftKey) {
			this.deselectAll();
		}
	},

	onClickMapViewer: function() {
		this.showMapViewer();
	},

	onEndDrag: function(event, viewport) {
		if (this.hasChildView('weather metar')) {
			this.getChildView('weather metar').onEndDrag(event, viewport);
		}
	},
	
	//
	// selection event handling methods
	//

	onSelect: function(item) {

		// perform callback
		//
		if (this.options.onselect) {
			this.options.onselect(item);
		}
	},

	onDeselect: function(item) {

		// perform callback
		//
		if (this.options.ondeselect) {
			this.options.ondeselect(item);
		}	
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
	// drag and drop event handling methods
	//

	onDropOut: function(item) {

		// perform callback
		//
		if (this.options.ondropout) {
			this.options.ondropout(item);
		}	
	},

	//
	// window event handling methods
	//

	onResize: function() {

		// call superclass method
		//
		MultiLayerMapView.prototype.onResize.call(this);

		// update map markers
		//
		this.placeMarkers();
	}
}));