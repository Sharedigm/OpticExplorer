/******************************************************************************\
|                                                                              |
|                           weather-buttons-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the view for a group of related toolbar buttons.         |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseView from '../../../../../../views/apps/common/toolbars/button-groups/grouped-button-view.js';
import WeatherLayerButtonView from '../../../../../../views/apps/map-viewer/mainbar/toolbar/weather/weather-layer-button-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	
	tagName: 'div',
	className: 'tools',

	template: template(`
		<div class="show-satellite" data-toggle="tooltip" title="Satellite" data-placement="bottom"></div>
		<div class="show-radar" data-toggle="tooltip" title="Radar" data-placement="bottom"></div>
		<div class="show-temperature" data-toggle="tooltip" title="Temperature" data-placement="bottom"></div>
		<div class="show-metar" data-toggle="tooltip" title="Metar / TAF" data-placement="bottom"></div>
		<div class="show-wind" data-toggle="tooltip" title="Wind" data-placement="bottom"></div>
	`),

	regions: {
		satellite: '.show-satellite',
		radar: '.show-radar',
		temperature: '.show-temperature',
		metar: '.show-metar',
		wind: '.show-wind'
	},

	//
	// querying methods
	//

	selected: function() {
		let preferences = this.app.preferences;
		let mapLayers = preferences.get('map_layers');
		let weatherLayers = preferences.get('weather_layers');

		return {
			'show-weather': mapLayers.includes('weather'),
			'show-satellite': weatherLayers.includes('satellite'),		
			'show-radar': weatherLayers.includes('radar'),
			'show-temperature': weatherLayers.includes('temperature'),
			'show-metar': weatherLayers.includes('metar'),
			'show-wind': weatherLayers.includes('wind')
		};
	},

	//
	// setting methods
	//

	setSelected: function(selected) {
		let keys = Object.keys(this.regions);
		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (this.hasChildView(key)) {
				this.getChildView(key).setSelected(selected.includes(key));
			}
		}
	},

	//
	// rendering methods
	//

	onAttach: function() {
		this.app = this.getParentView('app');

		// show weather layer buttons
		//
		this.showChildView('satellite', new WeatherLayerButtonView({
			name: 'satellite',
			template: '<i class="fa fa-satellite"></i>',
		}));
		this.showChildView('radar', new WeatherLayerButtonView({
			name: 'radar',
			template: '<i class="fa fa-satellite-dish"></i>',
		}));
		this.showChildView('temperature', new WeatherLayerButtonView({
			name: 'temperature',
			template: '<i class="fa fa-thermometer-half"></i>',
		}));
		this.showChildView('metar', new WeatherLayerButtonView({
			name: 'metar',
			template: '<img class="svg" src="images/icons/binary/wind-sock-icon.svg">',
		}));
		this.showChildView('wind', new WeatherLayerButtonView({
			name: 'wind',
			template: '<i class="fa fa-wind"></i>',
		}));
	},

	//
	// event handling methods
	//

	onActivate: function() {
		let app = this.getParentView('app');
		let preferences = app.preferences;
		let weatherLayers = preferences.get('weather_layers') || [];
		this.setSelected(weatherLayers);
	}
});