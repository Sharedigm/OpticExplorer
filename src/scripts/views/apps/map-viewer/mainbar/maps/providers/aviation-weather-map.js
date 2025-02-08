/******************************************************************************\
|                                                                              |
|                           aviation-weather-map.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps from avaiationweather.gov.       |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import ArrayTileMapFlipped from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/array-tile-map-flipped.js';

export default class AviationWeatherMap extends ArrayTileMapFlipped {

	constructor(options) {
		let date = options.date || new Date();
		let year = date.getUTCFullYear().toString();
		let month = (date.getUTCMonth() + 1).toString();
		let day = date.getUTCDate().toString();
		let hours = date.getUTCHours().toString();
		let minutes = date.getUTCMinutes().toString();

		// make sure that dates have at least two digits
		//
		if (month.length < 2) {
			month = '0' + month;
		}
		if (day.length < 2) {
			day = '0' + day;
		}
		if (hours.length < 2) {
			hours = '0' + hours;
		}
		if (minutes.length < 2) {
			minutes = '0' + minutes;
		}

		// call superclass constructor
		//
		super(options);

		// set attributes
		//
		this.mode = options.mode || 'satellite_vis';
		this.date = year + month + day  + hours + minutes;
		this.tile_server = config.mapping.aviationweather.server;
		this.maxZoomLevel = 17;
	}

	//
	// tile getting methods
	//

	getTileBase() {
		switch (this.mode) {
			case 'satellite_vis':
				return this.tile_server + '?product=sat_vis&date=' + this.date;
			case 'satellite_ir':
				return this.tile_server + '?product=sat_ir&date=' + this.date;
			case 'radar':
				return this.tile_server + '?product=rad_rala&date=' + this.date;
		}
	}

	getTileUrl(addr) {
		let x = addr[0];
		let y = addr[1];
		let z = addr[2];
		return this.getTileBase() + '&x=' + x + '&y=' + y + '&z=' + z;
	}
}