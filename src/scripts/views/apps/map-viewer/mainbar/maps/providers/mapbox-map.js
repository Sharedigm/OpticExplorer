/******************************************************************************\
|                                                                              |
|                                mapbox-map.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps using tiles from MapBox.         |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import ArrayTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/array-tile-map.js';

export default class MapBoxMap extends ArrayTileMap {

	constructor(options) {

		// call superclass constructor
		//
		super(options);

		// set attributes
		//
		this.mode = options.mode || 'vfr';
		this.tile_server = config.mapping.mapbox.server;
		this.maxZoomLevel = 20;
	}

	//
	// tile getting methods
	//

	getTileUrl(addr) {
		let x = addr[0];
		let y = addr[1];
		let z = addr[2];
		return this.tile_server + '/' + z + '/' + x + '/' + y + '.png?access_token=' + config.mapping.mapbox.appKey;
	}
}