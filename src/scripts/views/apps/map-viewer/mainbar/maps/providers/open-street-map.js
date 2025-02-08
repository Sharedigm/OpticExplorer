/******************************************************************************\
|                                                                              |
|                              open-street-map.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps from openstreetmap.              |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import ArrayTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/array-tile-map.js';

export default class OpenStreetMap extends ArrayTileMap {

	constructor(options) {

		// call superclass constructor
		//
		super(options);

		// set attributes
		//
		this.tile_server = this.getTileServer(options.mode);
		this.maxZoomLevel = 20;
	}

	//
	// tile getting methods
	//

	getTileServer(mode) {
		switch (mode) {
			case 'paths':
				return 'https://a.tile.thunderforest.com/cycle';
			case 'streets':
				return 'https://tile.openstreetmap.org';
			case 'transportation':
				return 'https://tileserver.memomaps.de/tilegen';
			default:
				return 'https://tile.openstreetmap.org';
		}
	}

	getTileUrl(addr) {
		let x = addr[0];
		let y = addr[1];
		let z = addr[2];
		return this.tile_server + '/' + z + '/' + x + '/' + y + '.png';
	}
}