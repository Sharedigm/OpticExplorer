/******************************************************************************\
|                                                                              |
|                                  bounds2.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines two dimensional set of bounds.                           |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Vector2 from '../math/vector2.js';
import Bounds from './bounds.js';

export default class Bounds2 {

	constructor(value1, value2) {

		// set attributes
		//
		if (value1 instanceof Bounds) {

			// convert from x, y bounds
			//
			this.left = value1.min;
			this.right = value1.max;
			this.bottom = value2.min;
			this.top = value2.max;
		}  else if (value1 instanceof Vector2) {

			// convert from x, y coords
			//
			this.left = value1.x;
			this.right = value2.x;
			this.bottom = value1.y;
			this.top = value2.y;
		} else if (value1 != undefined) {

			// convert from bounds
			//
			this.left = value1.left;
			this.right = value1.right;
			this.bottom = value1.bottom;
			this.top = value1.top;
		}
	}

	//
	// querying methods
	//

	contains(point) {
		return (point.x > this.left && point.x < this.right) &&
			(point.y > this.bottom && point.y < this.top);
	}

	overlaps(bounds) {
		return this.hBounds().overlaps(bounds.hBounds()) &&
			this.vBounds().overlaps(bounds.vBounds());
	}

	within(center, radius) {
		let vertices = this.getVertices();
		for (let i = 0; i < vertices.length; i++) {
			if (vertices[i].distanceTo(center) < radius) {
				return true;
			}
		}
		return false;
	}

	//
	// computing methods
	//

	center() {
		return new Vector2((this.left + this.right) / 2,
			(this.bottom + this.top) / 2);
	}

	width() {
		return this.right - this.left;
	}

	height() {
		return this.top - this.bottom;
	}

	size() {
		return new Vector2(this.width(), this.height());
	}

	hBounds() {
		return new Bounds(this.left, this.right);
	}

	vBounds() {
		return new Bounds(this.bottom, this.top);
	}

	offsetBy(offset) {
		return new Bounds2({
			left: this.left + offset.x,
			right: this.right + offset.x,
			bottom: this.bottom + offset.y,
			top: this.top + offset.y
		});
	}

	//
	// getting methods
	//

	getVertices() {
		let upperLeft = new Vector2(this.left, this.top);
		let upperRight = new Vector2(this.right, this.top);
		let lowerLeft = new Vector2(this.left, this.bottom);
		let lowerRight = new Vector2(this.right, this.bottom);
		return [upperLeft, upperRight, lowerLeft, lowerRight];
	}

	//
	// setting methods
	//

	extendToPosition(position) {
		if (position) {
			if (this.left == undefined || position.left < this.left) {
				this.left = position.left;
			}
			if (this.right == undefined || position.left > this.right) {
				this.right = position.left;
			}
			if (this.bottom == undefined || position.top < this.bottom) {
				this.bottom = position.top;
			}
			if (this.top == undefined || position.top > this.top) {
				this.top = position.top;
			}
		}
	}

	extendToBounds(bounds) {
		if (bounds) {
			if (this.left == undefined || bounds.left < this.left) {
				this.left = bounds.left;
			}
			if (this.right == undefined || bounds.right > this.right) {
				this.right = bounds.right;
			}
			if (this.bottom == undefined || bounds.bottom < this.bottom) {
				this.bottom = bounds.bottom;
			}
			if (this.top == undefined || bounds.top > this.top) {
				this.top = bounds.top;
			}
		}
	}
}