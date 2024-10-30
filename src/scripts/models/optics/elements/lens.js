/******************************************************************************\
|                                                                              |
|                                    lens.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a single lens element.                      |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Element from '../../../models/optics/elements/element.js';
import Planar from '../../../models/optics/elements/surfaces/planar.js';
import Spherical from '../../../models/optics/elements/surfaces/spherical.js';
import Material from '../../../models/optics/materials/material.js';
import LightUtils from '../../../utilities/optics/light-utils.js';
import Vector2 from '../../../utilities/math/vector2.js';
import Bounds2 from '../../../utilities/bounds/bounds2.js';
import Units from '../../../utilities/math/units.js';

export default Element.extend({

	//
	// converting methods
	//

	toObject: function() {
		let object = {
			type: 'element',
			surfaces: [
				this.get('front').toObject(),
				this.get('back').toObject()
			],
			thickness: this.get('thickness').toString()
		};

		// add optional attributes
		//
		if (this.has('spacing')) {
			object.spacing = this.get('spacing').toString();
		}
		if (this.get('beveled')) {
			object.beveled = this.get('beveled');
		}
		if (this.has('material')) {
			object.material = this.get('material').toObject()
		}

		return object;
	},

	//
	// querying methods
	//

	isPlanar: function() {
		return this.front instanceof Planar && this.back instanceof Planar;
	},

	isCemented: function() {
		return this.isCementedTo(this.next());
	},

	isCementedTo(next) {
		if (!this.spacing) {
			if (next && next.front && this.back.radius_of_curvature == next.front.radius_of_curvature) {
				return true;
			}
		} else {
			return false;
		}
	},

	hasFlatEdges: function() {
		return this.front.radius == this.back.radius;
	},

	clone: function() {
		return new this.constructor({
			front: this.get('front').clone(),
			back: this.get('back').clone(),
			thickness: this.get('thickness').clone(),
			beveled: this.get('beveled'),
			spacing: this.has('spacing')? this.get('spacing').clone() : null,
			material: this.get('material')
		});
	},

	flipped: function() {
		this.clone().set({
			front: this.get('back').flipped(),
			back: this.get('front').flipped()
		});
	},

	//
	// getting methods
	//

	getAperture: function() {
		return this.front.radius * 2;
	},

	getKind: function() {
		switch (this.front.getProfile()) {

			case 'planar':
				switch (this.back.getProfile()) {

					case 'planar':
						return 'planar';

					case 'spherical':
						if (this.back.isConvex()) {
							return 'plano concave';
						} else if (this.back.isConcave()) {
							return 'plano convex';
						}
				}
				break;

			case 'spherical':
				switch (this.back.getProfile()) {

					case 'planar':
						if (this.front.isConvex()) {
							return 'convex plano';
						} else if (this.front.isConcave()) {
							return 'concave plano';
						}
						break;

					case 'spherical':
						if (this.front.isConvex()) {
							if (this.back.isConvex()) {
								return 'positive meniscus';
							} else if (this.back.isConcave()) {
								return 'biconvex';
							}
						} else if (this.front.isConcave()) {
							if (this.back.isConvex()) {
								return 'biconcave';
							} else if (this.back.isConcave()) {
								return 'negative meniscus';
							}
						}
						break;
				}
				break;
		}
	},

	getRadius: function() {
		return this.getMaxRadius();	
	},

	getDiameter: function() {
		return this.getMaxDiameter();	
	},

	getMinRadius: function() {
		return Math.min(this.front.radius, this.back.radius);
	},

	getMinDiameter: function() {
		return Math.min(this.front.diameter, this.back.diameter);
	},

	getMaxRadius: function() {
		return Math.max(this.front.radius, this.back.radius);
	},

	getMaxDiameter: function() {
		return Math.max(this.front.diameter, this.back.diameter);
	},

	getMinRadiusOfCurvature: function() {
		let front = Math.abs(this.front.radius_of_curvature || 0);
		let back = Math.abs(this.back.radius_of_curvature || 0);
		return Math.min(front, back);
	},

	getMaxRadiusOfCurvature: function() {
		let front = Math.abs(this.front.radius_of_curvature || 0);
		let back = Math.abs(this.back.radius_of_curvature || 0);
		return Math.max(front, back);
	},

	getCenterThickness: function() {
		return this.thickness;
	},

	getEdgeThickness: function() {
		let front = (this.front.isConvex()? -this.front.thickness : this.front.thickness);
		let back = (this.back.isConvex()? this.back.thickness : -this.back.thickness);
		return this.thickness + front + back;
	},

	getMinThickness: function() {
		let front = this.front.isConvex()? this.front.thickness : -this.front.thickness;
		let back = this.back.isConvex()? -this.back.thickness : this.back.thickness;
		return Math.max(0, front + back);
	},

	getMaxThickness: function() {
		let front = (this.front.isConcave()? this.front.thickness : 0);
		let back = (this.back.isConvex()? this.back.thickness : 0);
		return this.thickness + front + back;
	},

	getBounds: function() {
		let radius = this.getRadius();
		let thickness = this.getMaxThickness();
		let min = new Vector2(-thickness / 2, -radius);
		let max = new Vector2(thickness / 2, radius);
		return new Bounds2(min, max);
	},

	getPoints: function(divisions, options) {
		return this.front.getPoints(divisions, options);
	},

	getSurfaceIndex: function(surface) {
		if (surface == this.front) {
			return 0;
		} else if (surface == this.back) {
			return 1;
		}
	},

	getLensIndex: function() {
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
	// optical methods (thick lens equations)
	//

	getFocalLength: function(side) {
		let n = (this.material || this.collection.medium).getIndexOfRefraction();
		let r1, r2, d;

		if (n == 1) {
			return undefined;
		}

		switch (side) {

			case 'front':
				r1 = this.back.radius_of_curvature;
				r2 = this.front.radius_of_curvature;
				d = this.thickness;
				break;

			case 'back':
			default:
				r1 = this.front.radius_of_curvature;
				r2 = this.back.radius_of_curvature;
				d = -this.thickness;
				break;
		}

		// compute thick lens factor
		//
		let t;
		if (r1 != Infinity && r2 != Infinity) {
			t = (n - 1) * d / (n * r1 * r2);
		} else {
			t = 0;
		}

		// the 'lensmakers equation'
		//
		return 1 / ((n - 1) * (1 / r1 - 1 / r2 + t));
	},

	getPrincipalPlaneDistance: function(side) {
		let n = (this.material || this.collection.medium).getIndexOfRefraction() || 1;
		let f = this.getFocalLength(side);
		let d = this.thickness;
		let r;

		if (f == undefined) {
			return undefined;
		}

		switch (side) {
			case 'front':
				r = this.back.radius_of_curvature;
				break;

			case 'back':
			default:
				r = this.front.radius_of_curvature;
				break;
		}

		if (n == 0 || r == 0) {
			return undefined;
		}

		return -f * (n - 1) * d / (n * r);
	},

	//
	// setting methods
	//

	setAttribute: function(key, value, options) {

		// set geometry attributes
		//
		switch (key) {
			case 'front':
				this.front = value;
				this.front.index = 0;
				this.front.parent = this;
				break;
			case 'back':
				this.back = value;
				this.back.index = 1;
				this.back.parent = this;
				break;
			case 'thickness':
				this.thickness = value? value.in('mm') : 0;
				break;
			case 'beveled':
				this.beveled = value;
				break;
			case 'material':
				this.material = value;
				break;	
		}

		// call superclass method
		//
		Element.prototype.setAttribute.call(this, key, value, options);
	},

	set: function(key, value, options) {

		// call superclass method
		//
		Element.prototype.set.call(this, key, value, options);

		// update attributes
		//
		if (typeof key == 'object') {
			options = value;
		}
		this.update(options);
	},

	setSurface: function(surface, side) {
		switch (side) {
			case 'front':
				this.set({
					front: surface
				});
				break;
			case 'back':
				this.set({
					back: surface
				});
				break;
		}
	},

	flip: function(options) {
		let front = this.get('front');
		let back = this.get('back');

		// flip surfaces
		//
		if (front.flip) {
			front.flip(options);
		}
		if (back.flip) {
			back.flip(options);
		}

		// flip order of surfaces
		//
		this.set({
			front: back,
			back: front
		}, options);
	},

	//
	// loading methods
	//

	loadMaterial: function(options) {
		if (!this.material.isLoaded()) {
			let self = this;
			this.material.load({

				// callbacks
				//
				success: (material) => {
					
					// update lens
					//
					self.set('material', material, {
						silent: true
					});
					self.trigger('load');

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				},
				error: function() {

					// perform callback
					//
					if (options && options.error) {
						options.error();
					}		
				}
			});
		} else {

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}	
		}
	},

	//
	// rendering methods
	//

	update: function(options) {

		// set radius of lens to max radius of surfaces
		//
		if (this.front && this.back) {
			this.radius = Math.max(this.front.radius, this.back.radius);
		}

		// update listeners (lights)
		//
		if (!options || !options.silent) {
			this.trigger('change');
		}
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

		// find intersection with surface
		//
		let surface = options && options.reversed? this.back : this.front;
		let t = surface.intersect(ray, true);

		// check if ray misses
		//
		if (t == Infinity) {

			// ray is obstructed
			//
			if (fromMaterial && options.path) {
				options.path.obstructed = true;
			}

			return null;
		}

		// find intersection point and normal
		//
		let point = ray.location.plus(ray.direction.scaledBy(t));
		let normal = surface.getNormal(point).normalized();

		// save path point
		//
		if (options.path) {
			options.path.push(point.plus(origin));
		}

		// check if front surface is refective
		//
		if (this.front.isReflective()) {

			// reflection
			//
			ray.direction = LightUtils.reflect(ray.direction, normal);

			if (options.path) {
				options.path.obstructed = false;
				options.path.transmitted = true;
			}

			// go to next element
			//
			let element = this.next();

			return this.collection.traceRay(ray, origin, element, fromMaterial, {
				path: options.path,
				normals: options.normals,
				wavelength: options.wavelength,
				depth: options.depth + 1,
				max_depth: options.max_depth,
				reversed: true
			});
		}

		// compute indices of refraction
		//
		let fromIndex = (fromMaterial || this.collection.medium).getIndexOfRefraction(options.wavelength);
		let toIndex = (this.material || this.collection.medium).getIndexOfRefraction(options.wavelength);

		// refract ray
		//
		let refracted = LightUtils.refract(ray.direction, normal, fromIndex, toIndex);
		if (refracted) {

			// update ray
			//
			ray.direction = refracted;
			if (options.path) {
				options.path.transmitted = true;
			}
		} else {

			// total internal reflection
			//
			ray.direction = LightUtils.reflect(ray.direction, normal);
			if (options.path) {
				options.path.reflected = true;
				options.path.obstructed = true;
			}

			return ray;
		}

		// advance context
		//
		ray.location = point;

		// advance ray through material
		//
		ray.location.x -= this.thickness;

		// trace ray through lens
		//
		return this.traceRayThrough(ray, origin, this.collection.medium, {
			path: options.path,
			normals: options.normals,
			wavelength: options.wavelength,
			depth: options.depth + 1,
			max_depth: options.max_depth
		});
	},

	traceRayThrough: function(ray, origin, toMaterial, options) {

		// check for max ray depth
		//
		if (options.depth > options.max_depth) {
			return ray;
		}

		// find intersection with back surface
		//
		let surface = options && options.reversed? this.front : this.back;
		let t = surface.intersect(ray, true);

		// check if ray misses
		//
		if (t == Infinity) {

			// ray is obstructed
			//
			if (options.path) {
				options.path.obstructed = true;
			}
			return null;
		}

		// advance ray
		//
		origin.x += this.thickness;

		// check if cemented element
		//
		let next = this.nextVisible();
		if (this.isCementedTo(next)) {
			return next.traceRay(ray, origin, this.material, {
				path: options.path,
				normals: options.normals,
				wavelength: options.wavelength,
				depth: options.depth + 1,
				max_depth: options.max_depth
			});
		}

		// find intersection point and normal
		//
		let point = ray.location.plus(ray.direction.scaledBy(t));
		let normal = surface.getNormal(point).normalized();

		// save path point
		//
		if (options.path) {
			options.path.push(point.plus(origin));
		}

		// check if back surface is reflective
		//
		if (this.back.isReflective()) {

			// reflection
			//
			ray.direction = LightUtils.reflect(ray.direction, normal);

			if (options.path) {
				options.path.obstructed = false;
				options.path.transmitted = true;
			}

			// advance context
			//
			ray.location = point;

			// go to next element
			//
			let element = this.next();

			return this.collection.traceRayThrough(ray, origin, element, this.material, {
				path: options.path,
				normals: options.normals,
				wavelength: options.wavelength,
				depth: options.depth + 1,
				max_depth: options.max_depth,
				reversed: true
			});
		}

		// compute indices of refraction
		//
		let fromIndex = (this.material || this.collection.medium).getIndexOfRefraction(options.wavelength);
		let toIndex = (toMaterial || this.collection.medium).getIndexOfRefraction(options.wavelength);

		// refract ray
		//
		let refracted = LightUtils.refract(ray.direction, normal, fromIndex, toIndex);
		if (refracted) {
			ray.direction = refracted;
		} else {

			// total internal reflection
			//
			ray.direction = LightUtils.reflect(ray.direction, normal);
			if (options.path) {
				options.path.reflected = true;
				options.path.obstructed = true;
			}

			return ray;
		}

		// advance context
		//
		ray.location = point;

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
			return this.collection.traceRay(ray, origin, element, toMaterial, {
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
	},

	intersect: function(ray, surface, inclusive) {
		if (surface == null) {

			// first surface
			//
			return this.front.intersect(ray, inclusive);
		} else if (surface == this.front) {

			// second surface
			//
			let ray2 = ray.clone();
			ray2.location.x -= this.thickness;
			return this.back.intersect(ray2, inclusive);
		} else {

			// no surface
			//
			return ray;
		}
	},

	nextSurface: function(fromSurface) {
		if (!fromSurface) {

			// first surface
			//
			return this.front;
		} else if (fromSurface == this.front) {

			// second surface
			//
			return this.back;
		} else {

			// no surface
			//
			return null;
		}
	}
}, {

	//
	// static methods
	//

	parseCatalogMaterial: function(name) {
		if (name.includes('/')) {
			return new Material({
				name: name.substring(name.lastIndexOf("/") + 1, name.length),
				catalog: name.substring(0, name.lastIndexOf("/"))
			})
		} else {
			return new Material({
				name: name,
				catalog: undefined
			});
		}
	},

	parseMaterial: function(material) {
		switch (typeof material) {
			case 'string':
				return this.parseCatalogMaterial(material);
			case 'object':
				return Material.parse(material);
		}
	},

	parseSurface: function(surface) {
		switch (surface.type) {
			case 'planar':
				return Planar.parse(surface);
			case 'spherical':
				return Spherical.parse(surface);
		}
	},

	parse: function(object) {

		// check lens data
		//
		if (!object.surfaces || !object.surfaces[0] || !object.surfaces[1]) {
			application.error({
				message: "Error parsing element surfaces: " + JSON.stringify(object)
			});
			return;
		}

		// parse lens
		//
		return new this.prototype.constructor({
			front: this.parseSurface(object.surfaces[0]),
			back: this.parseSurface(object.surfaces[1]),
			thickness: Units.parse(object.thickness),
			spacing: Units.parse(object.spacing),
			material: this.parseMaterial(object.material),
			beveled: object.beveled || false
		});
	}
});