/******************************************************************************\
|                                                                              |
|                                  spherical.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the class definition of a of spherical lens surface.          |
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
	// constructor
	//

	initialize: function(attributes) {

		// check to make sure that radius is valid
		//
		if (attributes.radius && attributes.radius.in('mm') > Math.abs(attributes.radius_of_curvature.in('mm'))) {
			attributes.radius = new Units(Math.abs(attributes.radius_of_curvature.in('mm')), 'mm')
		}
		if (attributes.diameter && attributes.diameter.in('mm') / 2 > Math.abs(attributes.radius_of_curvature.in('mm'))) {
			attributes.diameter = new Units(Math.abs(attributes.radius_of_curvature.in('mm')) * 2, 'mm')
		}

		// call superclass constructor
		//
		Surface.prototype.initialize.call(this, attributes);
	},

	//
	// converting methods
	//

	toObject: function() {
		if (this.has('diameter')) {
			return {
				type: "spherical",
				curvature: this.get('radius_of_curvature').toString(),
				diameter: this.get('diameter').toString(),
				coating: this.get('coating')
			}
		} else {
			return {
				type: "spherical",
				curvature: this.get('radius_of_curvature').toString(),
				radius: this.get('radius').toString(),
				coating: this.get('coating')
			}
		}
	},

	rocToCurvature: function(radiusOfCurvature) {
		return this.constructor.rocToCurvature(radiusOfCurvature, this.radius);
	},

	curvatureToROC: function(curvature) {
		return this.constructor.curvatureToROC(curvature, this.radius);
	},

	//
	// querying methods
	//

	isConvex: function() {
		return this.radius_of_curvature > 0;
	},

	isConcave: function() {
		return this.radius_of_curvature < 0;
	},

	sign: function() {
		return Math.sign(this.radius_of_curvature);
	},

	flipped: function() {
		let clone = this.clone();
		clone.flip();
		return clone;
	},

	has: function(key) {
		switch (key) {
			case 'radius':
				return true;
			case 'curvature':
				return true;
			default:
				return Surface.prototype.has.call(this, key);
		}
	},

	//
	// getting methods
	//

	get: function(key) {
		switch (key) {
			case 'radius':
				return this.get('diameter').times(0.5);
			case 'curvature':
				return new Units(this.getCurvature(), 'mm');
			default:
				return Surface.prototype.get.call(this, key);
		}
	},

	getProfile: function() {
		return 'spherical';
	},

	getSag: function() {
		if (this.radius_of_curvature && this.diameter) {
			return this.constructor.getSag(this.radius_of_curvature, this.diameter / 2);
		} else {
			return 0;
		}
	},

	getCurvature: function() {
		let radius = this.get('radius').in('mm');
		let radiusOfCurvature = this.get('radius_of_curvature').in('mm');
		return radius * radius / radiusOfCurvature;
	},

	getRadiusOfCurvature: function(sag) {
		return this.constructor.getRadiusOfCurvature(sag, this.radius);
	},

	getNormal: function(point) {
		return point.minus(this.center_of_curvature);
	},

	getMinCurvature: function() {
		switch (this.getSide()) {
			case 'front': {
				return -this.rocToCurvature(this.radius);
			}
			case 'back': {
				let oppositeSag = this.parent.front.getSag? this.parent.front.getSag() : 0;
				let sag = Math.min(this.parent.thickness - oppositeSag, this.radius);
				let radiusOfCurvature = this.getRadiusOfCurvature(sag);
				return -this.rocToCurvature(radiusOfCurvature);
			}
		}
	},

	getMaxCurvature: function() {
		switch (this.getSide()) {
			case 'front': {
				let oppositeSag = this.parent.back.getSag? this.parent.back.getSag() : 0;
				let sag = Math.min(this.parent.thickness + oppositeSag, this.radius);
				let radiusOfCurvature = this.getRadiusOfCurvature(sag);
				return this.rocToCurvature(radiusOfCurvature);
			}
			case 'back': {
				return this.rocToCurvature(this.radius);
			}
		}
	},

	getMaxRadius: function() {
		let thickness = this.parent.thickness;
		return Math.sqrt(2 * Math.abs(this.radius_of_curvature) * thickness - (thickness * thickness));
	},

	//
	// point getting methods
	//

	getLinearPoints: function(divisions, ymin, ymax) {
		let points = [];
		if (divisions > 1) {
			for (let i = 0; i < divisions; i++) {
				let t = i / (divisions - 1);
				let x = this.radius_of_curvature < 0? -this.thickness : 0;
				let y = ymin + (ymax - ymin) * t;
				points[i] = new Vector2(x, y);
			}
		} else {
			let t = 0.5;
			let x = this.radius_of_curvature < 0? -this.thickness : 0;
			let y = ymin + (ymax - ymin) * t;
			points[0] = new Vector2(x, y);			
		}

		return points;
	},

	getEquidistantPoints: function(divisions, ymin, ymax) {
		let points = [];
		if (divisions > 1) {
			for (let i = 0; i < divisions; i++) {
				let t = i / (divisions - 1);
				let y = ymin + (ymax - ymin) * t;
				let angle = Math.asin(y / this.radius_of_curvature);
				let x = this.radius_of_curvature * (1 - Math.cos(angle));
				points[i] = new Vector2(x, y);
			}
		} else {
			let t = 0.5;
			let y = ymin + (ymax - ymin) * t;
			let angle = Math.asin(y / this.radius_of_curvature);
			let x = this.radius_of_curvature * (1 - Math.cos(angle));
			points[0] = new Vector2(x, y);		
		}

		return points;
	},
	
	getEquiangularPoints: function(divisions, ymin, ymax) {
		if (ymin < -Math.abs(this.radius_of_curvature)) {
			ymin = -Math.abs(this.radius_of_curvature);
		}
		if (ymax > Math.abs(this.radius_of_curvature)) {
			ymax = Math.abs(this.radius_of_curvature);
		}

		let minAngle = Math.asin(ymin / this.radius_of_curvature);
		let maxAngle = Math.asin(ymax / this.radius_of_curvature);

		let points = [];
		if (divisions > 1) {
			for (let i = 0; i < divisions; i++) {
				let t = i / (divisions - 1);
				let angle = minAngle + (maxAngle - minAngle) * t;
				let y = this.radius_of_curvature * Math.sin(angle);
				let x = this.radius_of_curvature * (1 - Math.cos(angle));
				points[i] = new Vector2(x, y);
			}
		} else {
			let t = 0.5;
			let angle = minAngle + (maxAngle - minAngle) * t;
			let y = this.radius_of_curvature * Math.sin(angle);
			let x = this.radius_of_curvature * (1 - Math.cos(angle));
			points[0] = new Vector2(x, y);
		}
	
		return points;
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

		if (options && options.equidistant) {
			return this.getEquidistantPoints(divisions, ymin, ymax);
		} else {
			return this.getEquiangularPoints(divisions, ymin, ymax);
		}
	},

	//
	// setting methods
	//

	setAttribute: function(key, value) {

		// set geometry attributes
		//
		switch (key) {
			case 'curvature':
				this.curvature = value.in('mm');
				this.setAttribute('radius_of_curvature', new Units(this.curvatureToROC(value.in('mm')), 'mm'));
				break;
			case 'radius_of_curvature':
				this.radius_of_curvature = value? value.in('mm') : undefined;
				this.center_of_curvature = new Vector2(this.radius_of_curvature, 0);
				break;		
		}

		// call superclass method
		//
		Surface.prototype.setAttribute.call(this, key, value);
	},

	unset: function(attribute, options) {

		// unset object attributes
		//
		if (attribute == 'thickness') {
			this.thickness = undefined;
		}
		if (attribute == 'radius_of_curvature') {
			this.radius_of_curvature = undefined;
			this.center_of_curvature = undefined;
		}

		// call "superclass" method
		//
		Surface.prototype.unset.call(this, attribute, options);		
	},

	flip: function(options) {
		this.set({
			diameter: this.get('diameter').clone(),
			radius_of_curvature: this.get('radius_of_curvature').reversed()
		}, options);
	},

	//
	// ray tracing methods
	//

	intersect: function(ray, inclusive) {
		let location = ray.location.minus(this.center_of_curvature);
		let qa = ray.direction.dot(ray.direction);
		let qb = 2.0 * ray.direction.dot(location);
		let qc = location.dot(location) - Math.pow(this.radius_of_curvature, 2);
		let qd = qb * qb - 4.0 * qa * qc;
		
		// check discrimanant
		//
		if (qd < 0) {
			return Infinity;
		} else {
			let t, t1, t2;

			// find closest intersection which is not behind
			// the ray origin - find the smallest positive t
			//
			qd = Math.sqrt(qd);
			qa = 2.0 * qa;

			// the two intersections 
			//
			t1 = (-qb + qd) / qa;
			t2 = (-qb - qd) / qa;

			t = this.isConvex()? t2 : t1;

			// reject intersections that are behind us
			//
			let epsilon = inclusive? -Math.epsilon : Math.epsilon;
			if (t <= epsilon) {
				t = Infinity;
			}

			// reject intersections on back surface
			//
			if (this.isConvex() && location.x + t * ray.direction.x > 0) {
				t = Infinity;
			}

			// reject intersections outside of radius
			//
			if (Math.abs(location.y + t * ray.direction.y) > this.radius) {
				t = Infinity;
			}		

			return t;
		}
	}
}, {

	//
	// static methods
	//

	rocToCurvature: function(radiusOfCurvature, radius) {
		if (radiusOfCurvature == Infinity) {
			return 0;
		} else {
			return radius * (radius / radiusOfCurvature);
		}
	},

	curvatureToROC: function(curvature, radius) {
		if (curvature == 0) {
			return Infinity;
		} else {
			return radius * (radius  / curvature);
		}
	},

	getSag: function(radiusOfCurvature, radius) {
		let distanceToCenter = Math.sqrt(Math.abs(Math.sqr(radiusOfCurvature) - Math.sqr(radius)));
		return Math.sign(radiusOfCurvature) * (Math.abs(radiusOfCurvature) - distanceToCenter);
	},

	getRadiusOfCurvature: function(sag, radius) {
		return (Math.sqr(radius) + Math.sqr(sag)) / (2 * sag);
	},

	parse: function(object) {
		return new this.prototype.constructor({
			radius_of_curvature: Units.parse(object.curvature), 
			radius: Units.parse(object.radius),
			diameter: Units.parse(object.diameter),
			coating: object.coating
		});
	}
});