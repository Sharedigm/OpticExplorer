/******************************************************************************\
|                                                                              |
|                                 map-view.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for viewing maps.                            |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Place from '../../../../../models/places/place.js';
import MapViewportView from '../../../../../views/apps/map-viewer/mainbar/maps/map-viewport-view.js';
import Timeable from '../../../../../views/behaviors/effects/timeable.js';
import MapTiles from '../../../../../views/apps/map-viewer/mainbar/maps/tiles/map-tiles.js';
import BingMap from '../../../../../views/apps/map-viewer/mainbar/maps/providers/bing-map.js';
import OpenStreetMap from '../../../../../views/apps/map-viewer/mainbar/maps/providers/open-street-map.js';
import MapBoxMap from '../../../../../views/apps/map-viewer/mainbar/maps/providers/mapbox-map.js';
import IFlightPlannerMap from '../../../../../views/apps/map-viewer/mainbar/maps/providers/iflightplanner-map.js';
import MapMarkerView from '../../../../../views/apps/map-viewer/mainbar/maps/markers/map-marker-view.js';

export default MapViewportView.extend(_.extend({}, Timeable, {

	//
	// attributes
	//

	className: 'map viewport',
	updateInterval: 500,
	modes: [
		'map', 'satellite', 'hybrid', 
		'paths', 'streets', 'transportation', 'elevation',
		'sectional', 'ifrlo', 'ifrhi'
	],

	//
	// constructor
	//

	initialize: function(options) {

		// set optional parameter defaults
		//
		if (this.options.show_grid == undefined) {
			this.options.show_grid = true;
		}
		if (this.options.smoothing == undefined) {
			this.options.smoothing = true;
		}

		// call superclass constructor
		//
		MapViewportView.prototype.initialize.call(this, options);
	},

	//
	// lat / long getting methods
	//

	getMapMode: function () {
		if (this.map) {
			return this.map.mode;
		}
	},

	getAeroMode: function () {
		return this.aero_mode || 'vfr';
	},

	//
	// setting methods
	//

	setMap: function(map) {
		this.map = map;
		this.updateTiles();
	},

	setOption: function(key, value) {
		switch (key) {

			// map options
			//
			case 'map_mode':
				this.setMapMode(value);
				break;
			case 'aero_mode':
				this.setAeroMode(value);
				break;

			// viewport options
			//
			case 'show_smoothing':
				this.setSmoothing(value);
				break;
		}
	},

	setMapMode: function(mapMode) {
		this.map_mode = mapMode;

		// update view
		//
		this.setMap(this.constructor.getMap({
			latitude: this.map.latitude,
			longitude: this.map.longitude,
			zoom_level: this.map.zoom_level,
			mode: mapMode != 'aeronautical'? mapMode : this.aero_mode || 'vfr'
		}));
	},

	setAeroMode: function(aeroMode) {
		this.aero_mode = aeroMode;

		// update view
		//
		if (this.map_mode == 'aeronautical') {
			this.setMapMode('aeronautical');
		}
	},

	setSmoothing: function(smoothing) {
		if (smoothing) {
			this.$el.addClass('smoothed');
			this.$el.removeClass('pixelated');
		} else {
			this.$el.addClass('pixelated');
			this.$el.removeClass('smoothed');
		}
	},

	//
	// selection methods
	//

	selectAll: function() {

		// deselect children (overlays)
		//
		this.children.each((childView) => {
			if (childView.select) {
				childView.select();
			}
		});
	},

	deselectAll: function() {

		// deselect children (overlays)
		//
		this.children.each((childView) => {
			if (childView.deselect) {
				childView.deselect();
			}
		});
	},

	//
	// rendering methods
	//

	onAttach: function() {

		// call superclass method
		//
		MapViewportView.prototype.onAttach.call(this);

		// show background
		//
		this.setSmoothing(this.options.smoothing);
		this.updateTiles();
	},

	updateTiles: function() {

		// add tiles to viewport
		//
		if (this.map) {
			if (!this.tiles) {
				this.tiles = new MapTiles(this);
				this.$el.find('[name="normal"]').append(this.tiles.element);
			}
			this.tiles.render();
		}
	},

	showMarkers: function() {
		this.show(new MapMarkerView({
			model: new Place({
				latitude: 43.0635,
				longitude: 89.4197
			}),
			map: this.map
		}));
	},

	//
	// event handling methods
	//

	onChange: function(attribute) {

		// call superclass method
		//
		MapViewportView.prototype.onChange.call(this, attribute);

		// update view after a delay
		//
		if (!this.timeout) {
			this.timeout = this.setTimeout(() => {
				this.timeout = null;
				this.updateTiles();
			}, this.updateInterval);
		}
	},

	//
	// mouse event handling methods
	//

	onEndDrag: function(event, viewport) {

		// perform callback
		//
		if (this.options.onenddrag) {
			this.options.onenddrag(event, viewport);
		}
	},
}),{

	//
	// static methods
	//

	getMap: function(options) {
		switch (options.mode || 'hybrid') {
			case 'map':
			case 'aerial':
			case 'satellite':
			case 'hybrid':
				return new BingMap(options);
			
			case 'paths':
			case 'streets':
			case 'transportation':
				return new OpenStreetMap(options);
			case 'elevation':
				return new MapBoxMap(options);

			case 'vfr':
			case 'ifrlo':
			case 'ifrhi':
				return new IFlightPlannerMap(options);
		}
	},
});