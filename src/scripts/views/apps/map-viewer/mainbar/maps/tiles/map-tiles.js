/******************************************************************************\
|                                                                              |
|                                 map-tiles.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility to draw a grid of regularly spaced tiles.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import Tiles from '../../../../../../views/apps/map-viewer/mainbar/maps/tiles/tiles.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';

export default class MapTiles extends Tiles {

	//
	// constructor
	//

	constructor(mapView) {

		// call superclass constructor
		//
		super();

		// set attributes
		//
		this.className = 'tiles';
		this.element = this.getElement();
		this.mapView = mapView;
		this.mapTileResolution = 256;
		this.fadeDuration = 500;
		this.fadeDelay = 250;

		// get initial tiles
		//
		this.tiles = this.getTiles();
	}

	//
	// querying methods
	//

	sameImageAs(tile1, tile2) {
		return $(tile1).attr('href') == $(tile2).attr('href');
	}

	sameAs(tile1, tile2) {
		return $(tile1).attr('href') == $(tile2).attr('href') &&
			$(tile1).attr('x') == $(tile2).attr('x') &&
			$(tile1).attr('y') == $(tile2).attr('y');
	}

	//
	// getting methods
	//

	getElement() {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		$(element).addClass(this.className);
		return element;
	}

	getTiles() {

		// find zoom level
		//
		let magnification = Math.log2(this.mapView.scale);
		let zoom = Math.min(Math.round(magnification), this.mapView.map.maxZoomLevel - this.mapView.map.zoom_level);
		let zoomLevel = this.mapView.map.zoom_level + zoom;
		let tileScale = 2 ** (magnification - zoom);

		// find map parameters
		//
		let scale = 2 ** -zoom;
		let tileSize = this.mapView.tile_size * scale;
		let offset = this.mapView.getOffset().scaledBy(1 / tileSize);
		let tileX = Math.round(offset.x);
		let tileY = Math.round(offset.y);
		let tileCenter = new Vector2(tileX, tileY);

		// find center tile
		//
		let numTiles = this.mapView.map.numTiles();
		let offsetX = tileX * scale / numTiles;
		let offsetY = tileY * scale / numTiles;
		let addr = this.mapView.map.getCenterTileAddr(-offsetX, -offsetY, -zoom);

		// find center tile offset
		//
		let numTiles2 = this.mapView.map.numTilesAt(zoomLevel);
		let x = this.mapView.map.getX() * numTiles2;
		let y = this.mapView.map.getY() * numTiles2;
		let xOffset = (x - Math.trunc(x));
		let yOffset = (y - Math.trunc(y));
		let tileOffset = new Vector2(xOffset, yOffset);

		// get tiles around center tile
		//
		return this.getTilesAround(addr, tileSize, tileScale, tileCenter.plus(tileOffset));
	}

	getTilesAround(addr, tileSize, tileScale, tileCenter) {
		let tiles = [];
		let namespace = 'http://www.w3.org/2000/svg';
		let map = this.mapView.map;

		// find rows and columns
		//			
		let dimensions = this.mapView.getDimensions();
		let rows = Math.ceil(dimensions.y / tileSize) + 2;
		let columns = Math.ceil(dimensions.x / tileSize) + 2;

		// compute offsets
		//
		let rowOffset = Math.floor(rows / 2);
		let columnOffset = Math.floor(columns / 2);
		let tileOffset = new Vector2(-columnOffset, -rowOffset).minus(tileCenter);

		// go to upper left corner
		//
		for (let i = 0; i < rowOffset; i++) {
			addr = map.getNeighborTileAddr(addr, 'upper');
		}
		for (let i = 0; i < columnOffset; i++) {
			addr = map.getNeighborTileAddr(addr, 'left');
		}

		// add a bit of padding to tiles to hide edges
		//
		let tileSize2 = tileSize * (1 + 2 / this.mapTileResolution);

		// add tiles
		//
		let rowAddr = addr;
		for (let row = 0; row < rows; row++) {
			let columnAddr = rowAddr;
			for (let column = 0; column < columns; column++) {

				// create new tile
				//
				let image = document.createElementNS(namespace, 'image');
				let url = map.getTileUrl(columnAddr);
				image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
				image.setAttribute('width', tileSize2.toPrecision(7) + 'mm');
				image.setAttribute('height', tileSize2.toPrecision(7) + 'mm');
				image.setAttribute('x', ((tileOffset.x + column) * tileSize).toPrecision(7) + 'mm');
				image.setAttribute('y', ((tileOffset.y + row) * tileSize).toPrecision(7) + 'mm');
				image.setAttribute('onerror', "this.style.display='none'");

				// add tile to list
				//
				tiles.push(image);
				columnAddr = map.getNeighborTileAddr(columnAddr, 'right');
			}
			rowAddr = map.getNeighborTileAddr(rowAddr, 'lower');
		}
		return tiles;	
	}

	//
	// rendering methods
	//

	offsetTilesX(xOffset) {
		let tiles = $(this.element).children();
		for (let i = 0; i < tiles.length; i++) {
			let $tile = $(tiles[i]);
			let x = parseInt($tile.attr('x').replace('mm', ''));
			$tile.attr('x', (x + xOffset) + 'mm');
		}
	}

	render() {
		let tiles = this.getTiles();
		let existingTiles = $(this.element).children();
		let newTiles = this.getDifference(tiles, existingTiles);
		let oldTiles = this.getDifference(existingTiles, tiles);

		function add(tiles, tile) {
			$(tile).hide().fadeIn(tiles.fadeDuration);
			$(tiles.element).append(tile);
		}

		function remove(tiles, tile) {
			window.setTimeout(() => {
				$(tile).fadeOut(tiles.fadeDuration, () => {
					$(tile).remove();
				});
			}, tiles.fadeDelay);
		}

		// shift tiles
		//
		/*
		for (let i = 0; i < newTiles.length; i++) {
			let newTile =  newTiles[i];
			let existingTile = this.getTile(existingTiles, newTile);
			if (existingTile) {
				existingTile.attr('x', newTiles[i].attr('x'));
				existingTile.attr('y', newTiles[i].attr('y'));
			}
		}
		*/

		// remove no longer needed tiles
		//
		for (let i = 0; i < oldTiles.length; i++) {
			remove(this, oldTiles[i]);
		}

		// add new tiles
		//
		for (let i = 0; i < newTiles.length; i++) {
			add(this, newTiles[i]);
		}
	}
}