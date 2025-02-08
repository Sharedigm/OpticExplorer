/******************************************************************************\
|                                                                              |
|                                   map.js                                     |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is an abstract utility for rendering maps using tiles.           |
|                                                                              |
|******************************************************************************|
|            Copyright (c) 2020, Megahed Labs, www.megahedlabs.com             |
\******************************************************************************/

import Mercator from '../../../../../../views/apps/map-viewer/mainbar/maps/projections/mercator.js';
import Vector2 from '../../../../../../utilities/math/vector2.js';

export default class Map {

	constructor(options) {

		// set attributes
		//
		this.latitude = options.latitude;
		this.longitude = options.longitude;
		this.zoom_level = options.zoom_level;
		this.projection = new Mercator();
	}

	//
	// getting methods
	//

	getCopy() {
		let copy = Object.assign({}, this);
		Object.setPrototypeOf(copy, Object.getPrototypeOf(this));
		return copy;
	}

	//
	// map coordinate getting methods
	//

	getX() {
		return this.projection.longitudeToX(this.longitude);
	}

	getY() {
		return this.projection.latitudeToY(this.latitude);
	}

	getCoords() {
		return new Vector2(this.getX(), this.getY());
	}

	getStretch() {
		return Math.cos(this.latitude * Math.PI / 180);
	}
}