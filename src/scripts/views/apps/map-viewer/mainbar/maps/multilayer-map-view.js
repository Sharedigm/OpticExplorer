/******************************************************************************\
|                                                                              |
|                            multilayer-map-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a map view that can have multiple layers.                |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import UserPreferences from '../../../../../models/preferences/user-preferences.js';
import Place from '../../../../../models/places/place.js';
import BaseView from '../../../../../views/base-view.js';
import LayersView from '../../../../../views/layout/layers-view.js';
import MapView from '../../../../../views/apps/map-viewer/mainbar/maps/map-view.js';
import MouseDragPanBehavior from '../../../../../views/svg/viewports/behaviors/navigation/mouse-drag-pan-behavior.js';
import MouseDragZoomBehavior from '../../../../../views/svg/viewports/behaviors/navigation/mouse-drag-zoom-behavior.js';
import MouseWheelZoomBehavior from '../../../../../views/svg/viewports/behaviors/navigation/mouse-wheel-zoom-behavior.js';

export default LayersView.extend({

	//
	// attributes
	//

	className: 'multilayer-map',
	layers: ['map'],

	// map controls
	//
	controls: '<button class="map-viewer btn btn-sm" data-toggle="tooltip" title="Map viewer" data-placement="left">' +
		'<i class="fa fa-map"></i>' + '</button>',

	events: {
		'mousedown .map': 'onMouseDown',
		'tap .map': 'onClick',
	},

	preferences: new UserPreferences(),
	behaviors: [],
	default_zoom_level: 9,

	//
	// constructor
	//

	initialize: function() {
		let preferences = this.options.preferences || this.preferences;

		// set attributes
		//
		this.map = this.options.map;
		if (this.map === undefined) {
			this.map = this.getDefaultMap(preferences);
		}
	},

	//
	// getting methods
	//

	getLatLon: function() {
		return this.getLayerView('map').getLatLon();
	},

	getZoomLevel: function() {
		return this.getLayerView('map').getZoomLevel();
	},

	getPlace: function() {
		let mapView = this.getLayerView('map');
		let latLon = mapView.getLatLon();

		return new Place({
			latitude: latLon.latitude,
			longitude: latLon.longitude,
			zoom_level: mapView.getZoomLevel()
		});
	},

	//
	// map querying methods
	//

	getMapMode: function() {
		let mapView = this.getLayerView('map');
		if (mapView && mapView.map) {
			return mapView.map.mode;
		}
	},

	getAeroMode: function() {
		let mapView = this.getLayerView('map');
		if (mapView && mapView.map) {
			return mapView.map.aero_mode;
		}
	},

	getDefaultMap: function(preferences) {
		return MapView.getMap({
			latitude: preferences.get('latitude'),
			longitude: preferences.get('longitude'),
			zoom_level: this.default_zoom_level,
			mode: preferences.get('map_mode')
		});
	},

	//
	// setting methods
	//

	setOption: function(key, value) {
		switch (key) {
			case 'map_mode':
				this.setMapMode(value);
				break;
			default:
				this.setLayersOption(key, value);
				break;
		}
	},

	setMapMode: function(mapMode) {
		this.getLayerView('map').setMapMode(mapMode);

		// update map layer class
		//
		if (mapMode != 'map') {
			this.$el.find('.map.layer').attr('class', mapMode + ' map layer');
		} else {
			this.$el.find('.map.layer').attr('class', 'map layer');		
		}
	},

	setLayersOption: function(key, value) {

		// set option for each layer
		//
		let layers = this.getLayers();
		for (let i = 0; i < layers.length; i++) {
			let layerView = this.getLayerView(layers[i]);
			if (layerView && layerView.setOption) {
				layerView.setOption(key, value);
			}
		}
	},

	//
	// adding methods
	//

	addBehaviors: function() {
		let mapView = this.getLayerView('map');

		// create mouse behaviors
		//
		this.behaviors = [
			new MouseDragPanBehavior(mapView, {
				button: 1,
				on: true
			}),
			new MouseDragZoomBehavior(mapView, {
				button: 2,
				on: true,
				minScale: mapView.zoomLevelToScale(1),
				maxScale: mapView.zoomLevelToScale(10)
			}),
			new MouseWheelZoomBehavior(mapView, {
				on: true,
				minScale: mapView.zoomLevelToScale(1),
				maxScale: mapView.zoomLevelToScale(10)
			})
		];
	},

	removeBehaviors: function() {
		if (this.behaviors) {
			for (let i = 0; i < this.behaviors.length; i++) {
				this.behaviors[i].off();
			}
			this.behaviors = null;
		}
	},

	//
	// rendering methods
	//

	onRender: function() {

		// call superclass method
		//
		LayersView.prototype.onRender.call(this);

		// show controls
		//
		if (this.options.show_controls) {
			this.showControls();
		}

		// add tooltip triggers
		//
		this.addTooltips({
			container: 'button'
		});
	},

	onAttach: function() {

		// add mouse behaviors to map
		//
		if (this.options.add_behaviors) {
			this.addBehaviors();
		}

		this.onLoad();
	},

	showLayer: function(layer, layerView) {

		// call superclass method
		//
		LayersView.prototype.showLayer.call(this, layer, layerView);

		// update map layer class
		//
		if (layer == 'map' && this.map.mode != 'map') {
			this.$el.find('.map.layer').attr('class', this.map.mode + ' map layer');
		}
	},

	getMapLayerView: function() {
		return new MapView({

			// options
			//
			map: this.map,
			show_grid: this.options.show_grid,
			show_smoothing: this.options.show_smoothing,
			arrow_style: this.preferences.get('arrow_style'),
			label_style: this.preferences.get('label_style'),

			// callbacks
			//
			onenddrag: (event, viewport) => this.onEndDrag(event, viewport),
			onchange: (attribute) => this.onChange(attribute)
		});
	},

	showControls: function() {
		this.showChildView('controls', new BaseView({
			className: 'buttons',
			template: template(this.controls)
		}));
	},

	//
	// marker placing methods
	//

	setLayerVisibility: function(layer, visible) {

		// do not allow hiding of base map
		//
		if (layer == 'map') {
			return;
		}

		// call superclass method
		//
		LayersView.prototype.setLayerVisibility.call(this, layer, visible);
	},

	//
	// event handling methods
	//

	onLoad: function() {

		// perform callback
		//
		if (this.options.onload) {
			this.options.onload();
		}
	},

	//
	// cleanup methods
	//

	onBeforeDestroy: function() {
		this.removeBehaviors();
	}
});