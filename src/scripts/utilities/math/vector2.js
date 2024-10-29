/******************************************************************************\
|                                                                              |
|                                  vector2.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a two dimensional vector type and its operations.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class Vector2 {

	constructor(x, y) {

		// set attributes
		//
		this.x = x;
		this.y = y;
	}

	//
	// querying methods
	//

	clone() {
		return new Vector2(this.x, this.y);
	}

	equals(vector) {
		return (vector && (this.x == vector.x) && (this.y == vector.y));
	}

	isTowards(vector) {
		return this.dot(vector) > 0;
	}

	isAwayFrom(vector) {
		return this.dot(vector) < 0;
	}

	isPerpendicularTo(vector) {
		return this.dot(vector) == 0;
	}

	isParallelTo(vector) {
		return this.dot(vector) == Math.sqrt(this.dot(this) * vector.dot(vector));
	}

	//
	// converting methods
	//

	toArray() {
		return [this.x, this.y];
	}

	toStrings(precision) {

		// set optional parameter defaults
		//
		if (!precision) {
			precision = Vector2.precision;
		}

		return [this.x.toPrecision(precision), this.y.toPrecision(precision)];
	}

	toString(separator, precision) {

		// set optional parameter defaults
		//
		if (!separator) {
			separator = Vector2.separator;
		}

		// convert to string
		//
		return this.toStrings(precision).join(separator);
	}

	//
	// vector arithmetic methods
	//

	add(vector) {
		this.x = this.x + vector.x;
		this.y = this.y + vector.y;
	}

	subtract(vector) {
		this.x = this.x - vector.x;
		this.y = this.y - vector.y;
	}

	multiplyBy(vector) {
		this.x = this.x * vector.x;
		this.y = this.y * vector.y;
	}

	divideBy(vector) {
		this.x = this.x / vector.x;
		this.y = this.y / vector.y;
	}

	scaleBy(scalar) {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
	}

	scaleTo(scalar) {
		this.normalize();
		this.scaleBy(scalar);
	}

	reverse() {
		this.scaleBy(-1);
	}

	normalize() {
		let length = this.length();
		if (length) {
			this.scaleBy(1 / length);
		}
	}

	//
	// vector function methods
	//

	plus(vector) {
		let x = this.x + vector.x;
		let y = this.y + vector.y;
		return new Vector2(x, y);
	}

	minus(vector) {
		let x = this.x - vector.x;
		let y = this.y - vector.y;
		return new Vector2(x, y);
	}

	times(vector) {
		let x = this.x * vector.x;
		let y = this.y * vector.y;
		return new Vector2(x, y);
	}

	dividedBy(vector) {
		let x = this.x / vector.x;
		let y = this.y / vector.y;
		return new Vector2(x, y);
	}

	scaledBy(scalar) {
		let x = this.x * scalar;
		let y = this.y * scalar;
		return new Vector2(x, y);
	}

	scaledTo(scalar) {
		let length = this.length();
		if (length != 0) {
			return this.scaledBy(scalar / length);
		}
	}

	reversed() {
		return this.scaledBy(-1);
	}

	normalized() {
		let length = this.length();
		if (length) {
			return this.scaledBy(1 / length);
		}
	}

	parallel(vector) {
		return vector.scaledBy(this.dot(vector) / vector.dot(vector));
	}

	perpendicular(vector) {
		return this.minus(this.parallel(vector));
	}

	toPerpendicular() {
		return new Vector2(-this.y, this.x);
	}

	towards(vector) {
		if (this.isTowards(vector)) {
			return this.clone();
		} else {
			return this.reversed();
		}
	}

	awayFrom(vector) {
		if (this.isAwayFrom(vector)) {
			return this.clone();
		} else {
			return this.reversed();
		}
	}

	//
	// operators
	// 

	dot(vector) {
		return (this.x * vector.x) + (this.y * vector.y);
	}

	determinant(vector) {
		return (this.x * vector.y) - (vector.x * this.y);
	}

	distanceTo(vector) {
		return this.minus(vector).length();
	}

	length() {
		return Math.sqrt(this.dot(this));
	}

	//
	// trigonometric methods
	//

	angleTo(vector, options) {
		let angle = Math.atan2(vector.y, vector.x) - Math.atan2(this.y, this.x);

		// convert to -180 to 180
		//
		if (angle < -Math.PI) {
			angle += (2 * Math.PI);
		}

		// convert to 0 to 360
		//
		if (options && options.positive && angle < 0) {
			angle += (2 * Math.PI);
		}

		// convert to degrees
		//
		if (!options || options && options.units == 'degrees') {
			angle *= 180 / Math.PI;
		}

		return angle;
	}

	//
	// rotation methods
	//

	rotateBy(angle) {
		let x = this.x * Math.cos(angle * Math.PI / 180) - this.y * Math.sin(angle * Math.PI / 180);
		let y = this.x * Math.sin(angle * Math.PI / 180) + this.y * Math.cos(angle * Math.PI / 180);
		this.x = x;
		this.y = y;
	}

	rotatedBy(angle) {
		let x = this.x * Math.cos(angle * Math.PI / 180) - this.y * Math.sin(angle * Math.PI / 180);
		let y = this.x * Math.sin(angle * Math.PI / 180) + this.y * Math.cos(angle * Math.PI / 180);
		return new Vector2(x, y);
	}

	//
	// static attributes
	//

	static precision = 3;
	static separator = ", ";

	//
	// static methods
	//

	static random() {
		let x = Math.random();
		let y = Math.random();
		return new Vector2(x, y);
	}

	static srandom() {
		let x = Math.random() * 2 - 1;
		let y = Math.random() * 2 - 1;
		return new Vector2(x, y);
	}

	static averageOf(vectors) {
		if (!vectors || vectors.length == 0) {
			return;
		}

		let sum = vectors[0];
		for (let i = 1; i < vectors.length; i++) {
			sum = sum.plus(vectors[i]);
		}
		return sum.scaledBy(1 / vectors.length);
	}

	static centerOf(vectors) {
		if (!vectors || vectors.length == 0) {
			return;
		}

		let min = vectors[0].clone();
		let max = vectors[0].clone();

		for (let i = 1; i < vectors.length; i++) {
			let vector = vectors[i];

			if (vector.x < min.x) {
				min.x = vector.x;
			}
			if (vector.x > max.x) {
				max.x = vector.x;
			}
			if (vector.y < min.y) {
				min.y = vector.y;
			}
			if (vector.y > max.y) {
				max.y = vector.y;
			}
		}

		let x = (min.x + max.x) / 2;
		let y = (min.y + max.y) / 2;

		return new Vector2(x, y);
	}
}