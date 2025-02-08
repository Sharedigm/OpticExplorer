/******************************************************************************\
|                                                                              |
|                          array-tile-map-flipped.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a map that indexes tiles using array indices.                 |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import ArrayTileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/array-tile-map.js';

export default class ArrayTileMapFlipped extends ArrayTileMap {

	//
	// tile addressing methods
	//

	getTileAddr(x, y, zoomLevel) {
		let numTiles = this.numTilesAt(zoomLevel);
		let h = Math.floor(numTiles * x);
		let v = Math.floor(numTiles * (1 - y));
		return [h, v, zoomLevel];
	}

	getNeighborTileAddr(addr, direction) {
		let x = addr[0];
		let y = addr[1];
		let z = addr[2];
		switch (direction) {
			case 'left':
				x -= 1;
				break;
			case 'right':
				x += 1;
				break;
			case 'upper':
				y += 1;
				break;
			case 'lower':
				y -= 1;
				break;
		}
		return [x, y, z];
	}
}