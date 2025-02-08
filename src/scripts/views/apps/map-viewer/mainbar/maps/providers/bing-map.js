/******************************************************************************\
|                                                                              |
|                                 bing-map.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps using tiles from Bing.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import QuadTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/quad-tile-map.js';

export default class BingMap extends QuadTileMap {

	constructor(options) {

		// call superclass constructor
		//
		super(options);

		// set attributes
		//
		this.mode = options.mode || 'hybrid';
		this.tile_server = config.mapping.bingmaps.server;
		this.maxZoomLevel = 20;
	}

	//
	// tile getting methods
	//

	getTileUrl(addr) {
		switch (this.mode) {
			case 'map':
			case 'roads':
				return this.tile_server + "/" + addr + "?it=G,L,LA";
			case 'aerial':
			case 'satellite':
				return this.tile_server + "/" + addr + "?it=A";
			case 'hybrid':
			default:
				return this.tile_server + "/" + addr + "?it=A,G,L,LA";
		}
	}
}