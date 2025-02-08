/******************************************************************************\
|                                                                              |
|                            weather-layers-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view used for displaying weather map layers.           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import MetarStations from '../../../../../collections/weather/metar-stations.js';
import WindStations from '../../../../../collections/weather/wind-stations.js';
import MapLayersView from '../../../../../views/apps/map-viewer/mainbar/layers/map-layers-view.js';
import MapView from '../../../../../views/apps/map-viewer/mainbar/maps/map-view.js';
import MapMarkersView from '../../../../../views/apps/map-viewer/mainbar/maps/markers/map-markers-view.js';
import StationMarkerView from '../../../../../views/apps/map-viewer/mainbar/markers/station-marker-view.js';
import WindMarkerView from '../../../../../views/apps/map-viewer/mainbar/markers/wind-marker-view.js';
import AviationWeatherMap from '../../../../../views/apps/map-viewer/mainbar/maps/providers/aviation-weather-map.js';
import AccuWeatherMap from '../../../../../views/apps/map-viewer/mainbar/maps/providers/accuweather-map.js';

export default MapLayersView.extend({

	//
	// attributes
	//

	layers: ['temperature', 'satellite', 'radar', 'metar', 'wind'],

	//
	// rendering methods
	//

	getWeatherMap:function(options) {
		switch (options.mode || 'hybrid') {

			case 'satellite_ir':
			case 'satellite_vis':
			case 'radar':
				return new AviationWeatherMap(options);

			case 'temperature':
				return new AccuWeatherMap(options);
		}
	},

	//
	// layer rendering methods
	//

	getNewLayerView: function(layer) {
		switch (layer) {
			case 'satellite':
				return this.getWeatherLayerView('satellite_ir');
			case 'radar':
				return this.getWeatherLayerView('radar');
			case 'temperature':
				return this.getWeatherLayerView('temperature');
			case 'metar':
				return this.getMetarLayerView('metar');
			case 'wind':
				return this.getWindLayerView('wind');
		}
	},

	getWeatherLayerView: function(mode) {
		return new MapView({

			// options
			//
			map: this.getWeatherMap({
				latitude: this.parent.map.latitude,
				longitude: this.parent.map.longitude,
				zoom_level: this.parent.map.zoom_level,
				mode: mode
			}),
			show_grid: false,
			show_smoothing: true
		});
	},

	getMetarLayerView: function() {
		return new MapMarkersView({
			collection: new MetarStations(),
			marker: StationMarkerView,
			latitude: this.parent.map.latitude,
			longitude: this.parent.map.longitude,
			zoom_level: this.parent.map.zoom_level,
			map: this.parent.map,
			limit: 100
		});
	},

	getWindLayerView: function() {
		return new MapMarkersView({
			collection: new WindStations(),
			marker: WindMarkerView,
			latitude: this.parent.map.latitude,
			longitude: this.parent.map.longitude,
			zoom_level: this.parent.map.zoom_level,
			map: this.parent.map,
			limit: 200
		});
	}
});