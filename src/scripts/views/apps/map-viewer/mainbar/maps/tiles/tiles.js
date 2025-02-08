/******************************************************************************\
|                                                                              |
|                                    tiles.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a utility to draw a grid of regularly spaced tiles.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

export default class Tiles {

	//
	// querying methods
	//

	contains(tiles, tile) {
		for (let i = 0; i < tiles.length; i++) {
			if (this.sameAs(tiles[i], tile)) {
				return true;
			}
		}
	}

	//
	// getting methods
	//

	getTile(tiles1, tile) {
		for (let i = 0; i < tiles1.length; i++) {
			if (this.sameAs(tiles1[i], tile)) {
				return tiles1[i];
			}
		}
	}

	getUnion(tiles1, tiles2) {
		let tiles = [];
		for (let i = 0; i < tiles1.length; i++) {
			let tile = tiles1[i];
			if (this.contains(tiles2, tile)) {
				tiles.push(tile);
			}
		}
		return tiles;
	}

	getDifference(tiles1, tiles2) {
		let tiles = [];
		for (let i = 0; i < tiles1.length; i++) {
			let tile = tiles1[i];
			if (!this.contains(tiles2, tile)) {
				tiles.push(tile);
			}
		}
		return tiles;
	}
	
	//
	// converting methods
	//

	toGroup(tiles) {
		let namespace = 'http://www.w3.org/2000/svg';
		let group = document.createElementNS(namespace, 'g');
		for (let i = 0; i < tiles.length; i++) {
			group.appendChild(tiles[i]);
		}
		return group;
	}
	
	//
	// rendering methods
	//

	render() {
		let tiles = this.getTiles();
		$(this.element).append(tiles);
		if (this.tiles) {
			for (let i = 0; i < this.tiles.length; i++) {
				$(this.tiles[i]).remove();
			}
		}
		this.tiles = tiles;
	}

	clear() {
		$(this.element).children().remove();
	}
}