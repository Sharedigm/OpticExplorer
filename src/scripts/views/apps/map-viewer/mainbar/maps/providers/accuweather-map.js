/******************************************************************************\
|                                                                              |
|                             accuweather-map.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps from accuweather.com.            |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import ArrayTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/array-tile-map.js';

export default class AccuWeatherMap extends ArrayTileMap {

	constructor(options) {
		let date = options.date || new Date();
		let year = date.getUTCFullYear().toString();
		let month = (date.getUTCMonth() + 1).toString();
		let day = date.getUTCDate().toString();
		let hours = date.getUTCHours().toString();
		let minutes = date.getUTCMinutes().toString();

		// call superclass constructor
		//
		super(options);

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

		// set attributes
		//
		this.mode = options.mode;
		this.date = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + '00Z';
		this.tile_server = config.mapping.accuweather.server;
		this.key = config.mapping.accuweather? config.mapping.accuweather.appKey : undefined;
		this.maxZoomLevel = 17;
	}

	//
	// tile getting methods
	//

	getTileUrl(addr) {
		let x = addr[0];
		let y = addr[1];
		let z = addr[2];
		let product = '26-1010';
		return this.tile_server + '/' + this.date + '/' + z + '/' + x + '/' + y + '.png' + '?apikey=' + this.key + '&display_products=' + product;
	}
}