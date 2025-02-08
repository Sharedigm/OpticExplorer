/******************************************************************************\
|                                                                              |
|                              quad-tile-map.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a map that indexes tiles based on quadtrees.                  |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import TileMap from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/tile-map.js';

export default class QuadTileMap extends TileMap {

	//
	// getting methods
	//

	tileXYToAddr(x, y, zoomLevel) {
		let addr = '';
		let xmin = 0, xmax = 1;
		let ymin = 0, ymax = 1;
		
		for (let i = 0; i < zoomLevel; i++) {
			let xmid = (xmin + xmax) / 2;
			let ymid = (ymin + ymax) / 2;
			if (y > ymid) {

				// upper part ("0" or "1" quadrants)
				//
				ymin = ymid;
				if (x < xmid) {

					// upper left quadrant - "0"
					//
					addr += "0";
					xmax = xmid;
				} else {

					// upper right quadrant - "1"
					//
					addr += "1";
					xmin = xmid;
				}
			} else {

				// lower part ("2" or "3" quadrants)
				//
				ymax = ymid;
				if (x < xmid) {

					// lower left quadrant - "2"
					//
					addr += "2";
					xmax = xmid;
				} else {

					// lower right quadrant - "3"
					//
					addr += "3";
					xmin = xmid;
				}
			}
		}
		return addr;
	}

	getNeighborTileAddr(addr, direction) {
		let parent = addr.substring(0, addr.length - 1);
		let quadrant = addr.charAt(addr.length - 1);

		if (direction == "left") {
			switch (quadrant) {
				case '0':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "1";
					break;
				case '1':
					quadrant = "0";
					break;
				case '2':
					parent = this.getNeighborTileAddr(parent, direction); 
					quadrant = "3";
					break;
				case '3':
					quadrant = "2";
					break;
			}
		} else if (direction == "right") {
			switch (quadrant) {
				case '0':
					quadrant = "1";
					break;
				case '1':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "0";
					break;
				case '2':
					quadrant = "3";
					break;
				case '3':
					parent = this.getNeighborTileAddr(parent, direction); 
					quadrant = "2";
					break;
			}
		} else if (direction == "upper") {
			switch (quadrant) {
				case '0':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "2";
					break;
				case '1':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "3";
					break;
				case '2':
					quadrant = "0";
					break;
				case '3':
					quadrant = "1";
					break;
			}
		} else if (direction == "lower") {
			switch (quadrant) {
				case '0':
					quadrant = "2";
					break;
				case '1':
					quadrant = "3";
					break;
				case '2':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "0";
					break;
				case '3':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "1";
					break;
			}
		} else if (direction == "upper left") {
			switch (quadrant) {
				case '0':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "3";
					break;
				case '1':
					parent = this.getNeighborTileAddr(parent, "upper");
					quadrant = "2";
					break;
				case '2':
					parent = this.getNeighborTileAddr(parent, "left");
					quadrant = "1";
					break;
				case '3':
					quadrant = "0";
					break;
			}
		} else if (direction == "upper right") {
			switch (quadrant) {
				case '0':
					parent = this.getNeighborTileAddr(parent, "upper");
					quadrant = "3";
					break;
				case '1':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "2";
					break;
				case '2':
					quadrant = "1";
					break;
				case '3':
					parent = this.getNeighborTileAddr(parent, "right");
					quadrant = "0";
					break;
			}
		} else if (direction == "lower left") {
			switch (quadrant) {
				case '0':
					parent = this.getNeighborTileAddr(parent, "left");
					quadrant = "3";
					break;
				case '1':
					quadrant = "2";
					break;
				case '2':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "1";
					break;
				case '3':
					parent = this.getNeighborTileAddr(parent, "lower");
					quadrant = "0";
					break;
			}
		} else if (direction == "lower right") {
			switch (quadrant) {
				case '0':
					quadrant = "3";
					break;
				case '1':
					parent = this.getNeighborTileAddr(parent, "right");
					quadrant = "2";
					break;
				case '2':
					parent = this.getNeighborTileAddr(parent, "lower");
					quadrant = "1";
					break;
				case '3':
					parent = this.getNeighborTileAddr(parent, direction);
					quadrant = "0";
					break;
			}
		}
		return parent + quadrant;
	}
}