/******************************************************************************\
|                                                                              |
|                                tile-map.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract utility for rendering maps using tiles.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import Map from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/map.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';

export default class TileMap extends Map {

	//
	// counting methods
	//

	numTiles() {
		return this.numTilesAt(this.zoom_level);
	}

	numTilesAt(zoomLevel) {
		return 2 ** (Math.min(Math.ceil(zoomLevel), this.maxZoomLevel));
	}

	//
	// tile coordinate getting methods
	//

	getTileX() {
		return this.projection.longitudeToX(this.longitude) * this.numTiles();
	}

	getTileY() {
		return this.projection.latitudeToY(this.latitude) * this.numTiles();
	}

	getTileCoords() {
		return new Vector2(this.getTileX(), this.getTileY());
	}

	//
	// tile dimension getting methods
	//

	getTileWidth(units) {
		let stretch = this.getStretch();
		let numTiles = this.numTiles();
		switch (units) {
			case 'degrees':
				return 360 * stretch / numTiles;
			case 'inches':
				return 24901 * 5280 * 12 * stretch / numTiles;
			case 'feet':
				return 24901 * 5280 * stretch / numTiles;
			case 'millimeters':
				return 40075 * 1000 * 1000 * stretch / numTiles;
			case 'centimeters':
				return 40075 * 1000 * 100 * stretch / numTiles;
			case 'meters':
				return 40075 * 1000 * stretch / numTiles;
		}
	}

	getTileHeight(units) {
		let stretch = this.getStretch();
		let numTiles = this.numTiles();
		switch (units) {
			case 'degrees':
				return 180 * stretch / numTiles;
			case 'inches':
				return 24859 * 5280 * 12 * stretch / numTiles;
			case 'feet':
				return 24859 * 5280 * stretch / numTiles; 
			case 'millimeters':
				return 40008 * 1000 * 1000 * stretch / numTiles;
			case 'centimeters':
				return 40008 * 1000 * 100 * stretch / numTiles;
			case 'meters':
				return 40008 * 1000 * stretch / numTiles;
		}
	}

	getCenterTileAddr(offsetX, offsetY, zoomOffset) {
		let x = this.getX() + (offsetX || 0);
		let y = 1 - this.getY() - (offsetY || 0);
		let zoomLevel = this.zoom_level - (zoomOffset || 0);
		if (x < 0) {
			x += Math.ceil(-x);
		}
		if (x > 1) {
			x -= Math.floor(x);
		}
		return this.tileXYToAddr(x, y, zoomLevel);
	}
}