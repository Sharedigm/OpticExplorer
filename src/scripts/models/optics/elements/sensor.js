/******************************************************************************\
|                                                                              |
|                                  sensor.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a type of optical component used to sense light.              |
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
			type: 'sensor',
			width: this.get('width').toString(),
			height: this.get('height').toString()
		};

		// add optional attributes
		//
		if (this.has('horizontal')) {
			object.horizontal = this.get('horizontal');
		}
		if (this.has('vertical')) {
			object.vertical = this.get('vertical');
		}

		return object;
	},

	//
	// getting methods
	//

	getSensorIndex: function() {
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

	getAperture: function() {
		return this.size;
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
			ymin = -this.size / 2;
			ymax = this.size / 2;			
		}

		let points = [];
		for (let i = 0; i < divisions; i++) {
			let t = i / (divisions - 1);
			let y = ymin + (ymax - ymin) * t;
			points[i] = new Vector2(0, y);
		}

		return points;
	},

	//
	// setting methods
	//

	setAttribute: function(key, value) {

		// set geometry attributes
		//
		switch (key) {
			case 'width':
				this.width = value.in('mm');
				break;
			case 'height':
				this.height = value.in('mm');
				break;
			case 'horizontal':
				this.horizontal = value;
				break;
			case 'vertical':
				this.vertical = value;
				break;
		}

		if (this.width && this.height) {
			this.size = Math.max(this.width, this.height);
		}

		// call superclass method
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

			// save point
			//
			if (options && options.path) {
				options.path.push(point.plus(origin));
			}

			// ray is projected
			//
			options.path.projected = true;
			return ray;

		// ray misses
		//
		} else {

			// add spacing
			//
			if (this.spacing) {
				ray.location = ray.location.clone();
			}

			// go to next element
			// 	
			let element = this.next();

			// trace ray through element
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

			// reject intersections outside of size
			//
			let y = ray.location.y + ray.direction.y * t;
			let r = Math.abs(y);
			if (r > this.size / 2) {
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

		// parse sensor
		//
		return new this.prototype.constructor({
			width: Units.parse(object.width),
			height: Units.parse(object.height),
			horizontal: object.horizontal,
			vertical: object.vertical
		});
	}
});