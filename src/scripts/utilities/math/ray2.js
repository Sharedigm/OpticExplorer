/******************************************************************************\
|                                                                              |
|                                   ray2.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a two dimensional ray type and its operations.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default class Ray2 {

	constructor(location, direction) {

		// set attributes
		//
		this.location = location;
		this.direction = direction;
	}

	//
	// querying methods
	//

	equals(ray) {
		return (ray && (this.location.equals(ray.location)) && (this.direction.equals(ray.direction)));
	}

	clone() {
		return new Ray2(this.location.clone(), this.direction.clone());
	}

	intersect(ray2) {
		let determinant = this.direction.determinant(ray2.direction);
		if (determinant != 0) {
			let direction = ray2.location.minus(this.location);
			return direction.determinant(ray2.direction) / determinant;
		} else {

			// rays are parallel
			//
			return Infinity;
		}
	}

	intersection(ray2) {
		let t = this.intersect(ray2);
		if (t != Infinity) {
			return this.location.plus(this.direction.scaledBy(t));
		}
	}

	//
	// function methods
	//

	plus(ray) {
		let location = this.location.plus(ray.location);
		let direction = this.direction.plus(ray.direction);
		return new Ray2(location, direction);
	}

	minus(ray) {
		let location = this.location.plus(ray.location);
		let direction = this.direction.plus(ray.direction);
		return new Ray2(location, direction);
	}

	scaledBy(scalar) {
		let location = this.location.clone();
		let direction = this.direction.scaledBy(scalar);
		return new Ray2(location, direction);
	}

	scaledTo(scalar) {
		let location = this.location.clone();
		let direction = this.direction.scaledTo(scalar);
		return new Ray2(location, direction);
	}
}