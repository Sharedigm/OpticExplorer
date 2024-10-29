/******************************************************************************\
|                                                                              |
|                                  vector.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a two dimensional vector type and its operations.        |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class Vector {

	constructor(x, y, z) {

		// set attributes
		//
		this.x = x;
		this.y = y;
		this.z = z;
	}

	//
	// querying methods
	//

	clone() {
		return new Vector(this.x, this.y, this.z);
	}

	equals(vector) {
		return (vector && (this.x == vector.x) && (this.y == vector.y) && (this.z == vector.z));
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
		return [this.x, this.y, this.z];
	}

	toStrings(precision) {

		// set optional parameter defaults
		//
		if (!precision) {
			precision = Vector.precision;
		}

		return [this.x.toPrecision(precision), this.y.toPrecision(precision), this.z.toPrecision(precision)];
	}

	toString(separator, precision) {

		// set optional parameter defaults
		//
		if (!separator) {
			separator = Vector.separator;
		}

		return this.toStrings(precision).join(separator);
	}

	//
	// vector arithmetic methods
	//

	add(vector) {
		this.x = this.x + vector.x;
		this.y = this.y + vector.y;
		this.z = this.z + vector.z;
	}

	subtract(vector) {
		this.x = this.x - vector.x;
		this.y = this.y - vector.y;
		this.z = this.z - vector.z;
	}

	multiplyBy(vector) {
		this.x = this.x * vector.x;
		this.y = this.y * vector.y;
		this.z = this.z * vector.z;
	}

	divideBy(vector) {
		this.x = this.x / vector.x;
		this.y = this.y / vector.y;
		this.z = this.z / vector.z;
	}

	scaleBy(scalar) {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
		this.z = this.z * scalar;
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
		let z = this.z + vector.z;
		return new Vector(x, y, z);
	}

	minus(vector) {
		let x = this.x - vector.x;
		let y = this.y - vector.y;
		let z = this.z - vector.z;
		return new Vector(x, y, z);
	}

	times(vector) {
		let x = this.x * vector.x;
		let y = this.y * vector.y;
		let z = this.z * vector.z;
		return new Vector(x, y, z);
	}

	dividedBy(vector) {
		let x = this.x / vector.x;
		let y = this.y / vector.y;
		let z = this.z / vector.z;
		return new Vector(x, y, z);
	}

	scaledBy(scalar) {
		let x = this.x * scalar;
		let y = this.y * scalar;
		let z = this.z * scalar;
		return new Vector(x, y, z);
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
		return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
	}

	cross(vector2) {
		let x = (this.y * vector2.z) - (this.z * vector2.y);
		let y = (this.z * vector2.x) - (this.x * vector2.z);
		let z = (this.x * vector2.y) - (this.y * vector2.x);
		return new Vector(x, y, z);
	}

	determinant(vector2, vector3) {
		let x = new Vector(this.x, vector2.x, vector3.x);
		let y = new Vector(this.y, vector2.y, vector3.y);
		let z = new Vector(this.z, vector2.z, vector3.z);
		return x.dot(y.cross(z));
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
		let angle = Math.acos(this.dot(vector) / (this.length() * vector.length()));

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
		let z = Math.random();
		return new Vector(x, y, z);
	}

	static srandom() {
		let x = Math.random() * 2 - 1;
		let y = Math.random() * 2 - 1;
		let z = Math.random() * 2 - 1;
		return new Vector(x, y, z);
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
			if (vector.z < min.z) {
				min.z = vector.z;
			}
			if (vector.z > max.z) {
				max.z = vector.z;
			}
		}

		let x = (min.x + max.x) / 2;
		let y = (min.y + max.y) / 2;
		let z = (min.z + max.z) / 2;

		return new Vector(x, y, z);
	}
}