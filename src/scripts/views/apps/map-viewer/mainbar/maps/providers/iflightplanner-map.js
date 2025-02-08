/******************************************************************************\
|                                                                              |
|                            iflightplanner-map.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps using tiles from SSEC.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import ArrayTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/array-tile-map.js';

export default class IFlightPlannerMap extends ArrayTileMap {

	constructor(options) {

		// call superclass constructor
		//
		super(options);

		// set attributes
		//
		this.mode = options.mode || 'vfr';
		this.tile_server = config.mapping.iflightplanner.server;
		this.maxZoomLevel = 20;
	}

	//
	// tile getting methods
	//

	getTileBase() {			
		switch (this.mode) {
			case 'ifrlo':
				return this.tile_server + '/Maps/Tiles/IFRLow';
			case 'ifrhi':
				return this.tile_server + '/Maps/Tiles/IFRHigh';
			default:
				return this.tile_server + '/Maps/Tiles/Sectional';
		}
	}

	getTileUrl(addr) {
		let x = addr[0];
		let y = addr[1];
		let z = addr[2];
		return this.getTileBase() + '/Z' + z + '/' + y + '/' + x + '.png';
	}
}