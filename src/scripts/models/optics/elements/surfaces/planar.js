/******************************************************************************\
|                                                                              |
|                                    planar.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the class definition of a of planar lens surface.             |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Surface from '../../../../models/optics/elements/surfaces/surface.js';
import Vector2 from '../../../../utilities/math/vector2.js';
import Units from '../../../../utilities/math/units.js';
import '../../../../utilities/math/math-utils.js';

export default Surface.extend({

	//
	// converting methods
	//

	toObject: function() {
		return {
			type: "planar",
			diameter: this.get('diameter').toString(),
			coating: this.get('coating')
		}
	},

	//
	// querying methods
	//

	isConvex: function() {
		return false;
	},

	isConcave: function() {
		return false;
	},

	sign: function() {
		return 1;
	},

	flipped: function() {
		return this.clone();
	},

	//
	// getting methods
	//

	get: function(key) {
		switch (key) {
			case 'radius':
				return this.get('diameter').times(0.5);
			default:
				return Surface.prototype.get.call(this, key);
		}
	},

	getProfile: function() {
		return 'planar';
	},

	//
	// setting methods
	//

	set: function(attributes, options) {
		
		// call "superclass" method
		//
		Surface.prototype.set.call(this, attributes, options);

		// set geometry attributes
		//
		this.thickness = 0;
		this.radius_of_curvature = Infinity;
	},

	//
	// ray tracing methods
	//
	
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
			if (Math.abs(y) > this.radius) {
				t = Infinity;
			}

			return t;
		} else {
			return Infinity;
		}
	},

	getNormal: function() {
		return new Vector2(1, 0);
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
	}
}, {

	//
	// static methods
	//

	parse: function(object) {
		return new this.prototype.constructor({
			diameter: Units.parse(object.diameter),
			coating: object.coating
		});		
	},
});