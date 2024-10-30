/******************************************************************************\
|                                                                              |
|                                   stop.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a type of optical element used to restrict light.             |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Element from '../../../models/optics/elements/element.js';
import Vector2 from '../../../utilities/math/vector2.js';
import Units from '../../../utilities/math/units.js';

export default Element.extend({

	//
	// converting methods
	//

	toObject: function() {
		let object = {
			type: 'stop',
			aperture: this.get('aperture').toString(),
			diameter: this.get('diameter').toString()
		};

		// add optional attributes
		//
		if (this.has('spacing')) {
			object.spacing = this.get('spacing').toString();
		}

		return object;
	},

	//
	// getting methods
	//

	getAperture: function() {
		return this.aperture;
	},

	getPoints: function(divisions, options) {
		let ymin, ymax;

		// set optional parameter defaults
		//
		if (options && options.aperture) {

			// use specified aperture
			//
			ymin = -options.aperture / 2;
			ymax = options.aperture / 2;	
		} else if (options && options.ymin && options.ymax) {

			// use specified ymin, ymax
			//
			ymin = options.ymin;
			ymax = options.ymax;
		} else {

			// use full aperture 
			//
			ymin = -this.radius;
			ymax = this.radius;			
		}

		let points = [];
		for (let i = 0; i < divisions; i++) {
			let t = i / (divisions - 1);
			let y = ymin + (ymax - ymin) * t;
			points[i] = new Vector2(0, y);
		}

		return points;
	},

	getStopIndex: function() {
		let index = 0;
		if (this.collection) {
			for (let i = 0; i < this.collection.length; i++) {
				let element = this.collection.at(i);
				if (element instanceof this.constructor) {
					if (element == this) {
						break;
					} else {
						index++;
					}
				}
			}
		}
		return index;
	},

	//
	// setting methods
	//

	setAttribute: function(key, value) {

		// set geometry attributes
		//
		switch (key) {
			case 'diameter':
				this.diameter = value.in('mm');
				this.radius = this.diameter / 2;
				break;
			case 'radius':
				this.radius = value.in('mm');
				this.diameter = this.radius * 2;
				break;
			case 'aperture':
				this.aperture = value.in('mm');
				this.aperture_radius = this.aperture / 2;
				break;
			case 'aperture_radius':
				this.aperture_radius = value.in('mm');
				this.aperture = this.aperture_radius * 2;
				break;
		}

		// call superclas method
		//
		Element.prototype.setAttribute.call(this, key, value);
	},

	//
	// ray tracing methods
	//

	traceRay: function(ray, origin, fromMaterial, options) {

		// check for max ray depth
		//
		if (options.depth > options.max_depth) {
			return ray;
		}

		// find intersection
		//
		let t = this.intersect(ray, true);

		// check if ray hits
		//
		if (t != Infinity && !isNaN(t)) {
			let point = ray.location.plus(ray.direction.scaledBy(t));

			// save path point
			//
			if (options.path) {
				options.path.push(point.plus(origin));
			}

			// ray is obstructed
			//
			if (options.path) {
				options.path.obstructed = true;
			}
			
			return null;

		// ray misses
		//
		} else {
			
			// add spacing
			//
			if (this.spacing) {
				ray.location = ray.location.clone();
				ray.location.x -= this.spacing;
				origin.x += this.spacing;
			}

			// go to next element
			// 	
			let element = this.next();

			// trace ray through next element
			//
			if (element) {
				return this.collection.traceRay(ray, origin, element, fromMaterial, {
					path: options.path, 
					normals: options.normals, 
					wavelength: options.wavelength, 
					depth: options.depth + 1,
					max_depth: options.max_depth
				});
			} else {

				// no more elements
				//
				return ray;
			}
		}
	},

	intersect: function(ray, inclusive) {
		if (ray.direction.x != 0) {
			let t = (-ray.location.x / ray.direction.x);

			// reject intersections that are behind us
			//
			if (t <= (inclusive? -Math.epsilon : Math.epsilon)) {
				t = Infinity;
			}

			// reject intersections outside of radius
			//
			let y = ray.location.y + ray.direction.y * t;
			let r = Math.abs(y);
			if (r < this.aperture / 2) {
				t = Infinity;
			}

			return t;
		} else {
			return Infinity;
		}
	}
}, {

	//
	// static methods
	//

	parse: function(object) {

		// parse aperture stop
		//
		return new this.prototype.constructor({
			diameter: Units.parse(object.diameter),
			aperture: Units.parse(object.aperture),
			spacing: Units.parse(object.spacing)
		});
	}
});