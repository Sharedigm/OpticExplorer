/******************************************************************************\
|                                                                              |
|                               microsoft-map.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps using tiles from Microsoft.      |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import QuadTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/quad-tile-map.js';

export default class MSMap extends QuadTileMap {

	constructor(options) {

		// call superclass constructor
		//
		super(options);

		// set attributes
		//
		this.mode = options.mode || 'hybrid';
		this.map_tile_server = config.mapping.microsoftmaps.servers.maps;
		this.aerial_tile_server = config.mapping.microsoftmaps.servers.aerial;
		this.hybrid_tile_server = config.mapping.microsoftmaps.servers.hybrid;
		this.maxZoomLevel = 20;
	}

	//
	// tile getting methods
	//

	getTileUrl(addr) {
		switch (this.mode) {
			case 'map':
			case 'roads':
				return this.map_tile_server + "/tiles" + "r" + addr + ".png" + "?g=45";
			case 'aerial':
			case 'satellite':
				return this.aerial_tile_server + "/tiles" + "a" + addr + ".png" + "?g=45";
			case 'hybrid':
			default:
				return this.hybrid_tile_server + "/tiles" + "h" + addr + ".png" + "?g=45";
		}
	}
}