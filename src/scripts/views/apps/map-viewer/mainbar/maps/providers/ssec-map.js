/******************************************************************************\
|                                                                              |
|                                 ssec-map.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility for rendering maps using tiles from SSEC.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import ArrayTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/array-tile-map.js';

export default class SsecMap extends ArrayTileMap {

	constructor(options) {

		// call superclass constructor
		//
		super(options);

		// set attributes
		//
		this.mode = options.mode || 'vfr';
		this.tile_server = 'https://realearth.ssec.wisc.edu';
		this.maxZoomLevel = 20;
	}

	//
	// tile getting methods
	//

	getTileBase() {
		switch (this.mode) {
			case 'ifrlo':
				return this.tile_server + '/api/image?products=&background=IFRLO';
			case 'ifrhi':
				return this.tile_server + '/api/image?products=&background=IFRHI';
			default:
				return this.tile_server + '/api/image?products=&background=VFR';
		}
	}

	getTileUrl(addr) {
		let x = addr[0];
		let y = addr[1];
		let z = addr[2];
		return this.getTileBase() + "&x=" + x + "&y=" + y + "&z=" + z;
	}
}