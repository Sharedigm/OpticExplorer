/******************************************************************************\
|                                                                              |
|                                     optics.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a collection of optical elements.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2024, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../models/base-model.js';
import Elements from '../../collections/optics/elements/elements.js';
import Lights from '../../collections/optics/lights/lights.js';
import Objects from '../../collections/optics/objects/objects.js';
import Paths from '../../collections/optics/ray-tracing/paths.js';
import Bounds2 from '../../utilities/bounds/bounds2.js';
import Vector2 from '../../utilities/math/vector2.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		name: 'Untitled'
	},

	//
	// constructor
	//

	initialize: function(attributes) {

		// set attributes
		//
		if (attributes) {
			this.elements = attributes.elements;
			this.lights = attributes.lights;
			this.objects = attributes.objects;
		}

		// create default attributes
		//
		if (!this.elements) {
			this.elements = new Elements();
		}
		if (!this.lights) {
			this.lights = new Lights();
		}
		if (!this.objects) {
			this.objects = new Objects();
		}
	},

	//
	// querying methods
	//

	hasVariableAperture: function() {
		if (this.has('aperture')) {
			let aperture = this.get('aperture');
			return typeof aperture == 'object' && ('min' in aperture || 'max' in aperture);
		} else {
			return false;
		}
	},

	hasVariableFocalLength: function() {
		if (this.has('focalLength')) {
			let focalLength = this.get('focalLength');
			return typeof focalLength == 'object' && ('min' in focalLength || 'max' in focalLength);
		} else {
			return false;
		}
	},

	hasVariableFocalRatio: function() {
		if (this.has('focalRatio')) {
			let focalRatio = this.get('focalRatio');
			return typeof focalRatio == 'object' && ('min' in focalRatio || 'max' in focalRatio);
		} else {
			return false;
		}
	},

	//
	// counting methods
	//

	numElements: function() {
		return this.elements.numElements();
	},

	numLenses: function() {
		return this.elements.numLenses();
	},

	numGroups: function() {
		return this.elements.numGroups();
	},

	//
	// getting methods
	//

	getValue: function(key) {
		return this.elements.getValue(key);
	},

	getAperture: function() {
		return this.elements.getAperture();
	},

	getLength: function() {
		return this.elements.getLength();
	},

	getDiameter: function() {
		return this.elements.getDiameter();
	},

	getBounds: function() {
		let width = this.getLength();
		let height = this.getDiameter();
		return new Bounds2(new Vector2(0, -height / 2), 
			new Vector2(width, height / 2));
	},

	getViewportSize: function(viewport) {
		return viewport.getWidth() / viewport.pixelsPerMillimeter / viewport.scale;
	},

	//
	// loading methods
	//

	load: function(options) {
		let self = this;

		// load dependencies
		//
		this.elements.loadMaterials({

			// callbacks
			//
			success: () => {
				self.lights.loadSpectra({

					// callbacks
					//
					success: function() {
						if (options && options.success) {
							options.success(self);
						}
					}
				});
			}
		});
	},

	//
	// ray tracing methods
	//

	traceRays: function(rays, options) {

		// set optional parameter defaults
		//
		if (!options) {
			options = {};
		}
		if (options.focus == undefined) {
			options.focus = true;
		}
		if (options.extend == undefined) {
			options.extend = true;
		}

		// create new beam
		//
		let paths = new Paths();
		let normals = undefined;
		let wavelength = undefined;
		let extension = options && options.viewport? this.getViewportSize(options.viewport): this.elements.getLength();

		// trace rays through elements
		//
		if (options.showNormals) {
			normals = [];
		}
		if (options.wavelength) {
			wavelength = options.wavelength 
		}
		rays = this.elements.traceRays(rays, paths, normals, wavelength, extension);

		// focus rays
		//
		if (options.focus && rays.length > 1) {
			paths.focusTo(rays, extension);
		}

		// extend rays
		//
		let extension2 = this.elements.getAperture() / 4;
		if (options.extend) {
			paths.extendBy(rays, extension, extension2);
		}

		return paths;
	},

	//
	// converting methods
	//

	toObject: function() {
		return {
			elements: this.elements.toObject(),
			lights: this.lights.toObject(),
			objects: this.objects.toObject()
		};
	},

	//
	// cleanup methods
	//

	onDestroy: function() {

		// destroy attributes
		//
		this.elements.destroy();

		// call superclass method
		//
		BaseModel.prototype.onDestroy.call(this);
	}
}, {

	//
	// static methods
	//

	focalLength: function(aperture, focalRatio) {

		// variable aperture and focal ratio
		//
		if ('min' in aperture && 'min' in focalRatio) {
			return {
				min: aperture.min.scaledBy(focalRatio.min),
				max: aperture.max.scaledBy(focalRatio.max)
			}

		// variable aperture
		//					
		} else if ('min' in aperture) {
			return {
				min: aperture.min.scaledBy(focalRatio),
				max: aperture.max.scaledBy(focalRatio)
			}

		// variable focal ratio
		//
		} else if ('min' in focalRatio) {
			return {
				min: aperture.scaledBy(focalRatio.min),
				max: aperture.scaledBy(focalRatio.max)
			}

		// fixed aperture and focal ratio
		//	
		} else {
			return aperture.scaledBy(focalRatio)
		}
	},

	aperture: function(focalLength, focalRatio) {

		// variable focal length and focal ratio
		//
		if ('min' in focalLength && 'min' in focalRatio) {
			return {
				min: focalLength.min.scaledBy(1 / focalRatio.min),
				max: focalLength.max.scaledBy(1 / focalRatio.max)
			}

		// variable focal length
		//
		} else if ('min' in focalLength) {
			return {
				min: focalLength.min.scaledBy(1 / focalRatio),
				max: focalLength.max.scaledBy(1 / focalRatio)
			}

		// variable focal ratio
		//					
		} else if (typeof focalRatio == 'object' && 'min' in focalRatio) {
			return {
				min: focalLength.scaledBy(1 / focalRatio.min),
				max: focalLength.scaledBy(1 / focalRatio.max)
			}

		// fixed focal length and focal ratio
		//	
		} else {
			return focalLength.scaledBy(1 / focalRatio)
		}
	},

	focalRatio: function(aperture, focalLength) {

		// variable aperture and focal length
		//
		if ('min' in aperture && 'min' in focalLength) {
			return {
				min: focalLength.min.ratioOf(aperture.min),
				max: focalLength.max.ratioOf(aperture.max)
			}

		// variable aperture
		//
		} else if ('min' in aperture) {
			return {
				min: focalLength.ratioOf(aperture.min),
				max: focalLength.ratioOf(aperture.max)
			}

		// variable focal length
		//					
		} else if ('min' in focalLength) {
			return {
				min: focalLength.min.ratioOf(aperture),
				max: focalLength.max.ratioOf(aperture)
			}

		// fixed aperture and focal length
		//	
		} else {
			return focalLength.ratioOf(aperture)
		}
	}
});