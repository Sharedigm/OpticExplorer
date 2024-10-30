/******************************************************************************\
|                                                                              |
|                                  elements.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a collection of optical elements.           |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Element from '../../../models/optics/elements/element.js';
import Lens from '../../../models/optics/elements/lens.js';
import Stop from '../../../models/optics/elements/stop.js';
import Sensor from '../../../models/optics/elements/sensor.js';
import Path from '../../../models/optics/ray-tracing/path.js';
import BaseCollection from '../../../collections/base-collection.js';
import Paths from '../../../collections/optics/ray-tracing/paths.js';
import Rays2 from '../../../collections/optics/ray-tracing/rays2.js';
import Surfaces from '../../../collections/optics/elements/surfaces/surfaces.js';
import Materials from '../../../collections/optics/materials/materials.js';
import CommonMaterials from '../../../collections/optics/materials/catalogs/common-materials.js';
import Vector2 from '../../../utilities/math/vector2.js';
import Ray2 from '../../../utilities/math/ray2.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Element,

	defaults: {
		'max-ray-depth': 50
	},

	//
	// constructor
	//

	initialize: function() {

		// set attributes
		//
		this.medium = CommonMaterials.named('air');
	},

	//
	// querying methods
	//

	hasElements: function(filter) {
		return this.numElements(filter) > 0;
	},

	hasStops: function() {
		return this.numStops() > 0;
	},

	hasMount: function() {
		let stops = this.getStops();
		if (stops && stops.length > 1) {
			let lastStop = stops[stops.length - 1];
			let next = lastStop.next();
			return next && next instanceof Sensor;
		}
	},

	hasSensor: function() {
		return this.numSensors() > 0;
	},

	//
	// counting methods
	//

	numElements: function(filter) {
		return this.getElements(filter).length;
	},

	numLenses: function() {
		return this.getLenses().length;
	},

	numGroups: function() {
		let groups = 0;
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model instanceof Lens && !model.isCemented()) {
				groups++;
			}
		}
		return groups;
	},

	numMaterials: function() {
		return this.getUniqueMaterials().length;
	},

	//
	// surface, stop and sensor counting methods
	//

	numSurfaces: function() {
		let count = 0;

		// count number of lens surfaces
		//
		for (let i = 0; i < this.length; i++) {
			let element = this.at(i);
			if (element instanceof Lens) {
				if (element.isCemented()) {
					count += 1;
				} else {
					count += 2;
				}
			}
		}

		return count;	
	},

	numStops: function() {
		return this.getStops().length;
	},

	numSensors: function() {
		return this.getSensors().length;
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {

			// dimensions
			//
			case 'aperture':
				return this.getAperture();
			case 'radius':
				return this.getRadius();
			case 'diameter':
				return this.getDiameter();
			case 'length':
				return this.getLength();
			case 'optical_length':
				return this.getOpticalLength();

			// counts
			//
			case 'num_elements':
				return this.numElements();
			case 'num_lenses':
				return this.numLenses();
			case 'num_groups':
				return this.numGroups();
			case 'num_materials':
				return this.numMaterials();
			case 'num_items':
				return this.numItems();

			// optics
			//
			case 'focal_ratio':
				return this.getFocalRatio();
			case 'focal_length':
				return this.getFocalLength();
			case 'back_focal_length':
				return this.getBackFocalLength();
			case 'total_track_length':
				return this.getTotalTrackLength();
			case 'entrance_pupil_diameter':
				return this.getEntrancePupilDiameter();
			case 'exit_pupil_distance':
				return this.getExitPupilDistance();
		}
	},

	//
	// dimension getting methods
	//

	getAperture: function() {
		if (this.length > 0) {
			let first = this.firstVisible();

			// get diameter of first surface of element
			//
			if (first) {
				if (first.front) {
					return first.front.getAperture();
				} else {
					return first.getAperture();
				}
			}
		}
	},

	getRadius: function() {
		let radius = 0;

		// find max element radius
		//
		for (let i = 0; i < this.length; i++) {
			if (this.at(i).radius > radius) {
				radius = this.at(i).radius;
			}
		}

		return radius;
	},

	getDiameter: function() {
		return this.getRadius() * 2;
	},

	getLength: function() {

		// compute length of elements
		//
		let length = 0;
		for (let i = 0; i < this.length; i++) {
			let element = this.at(i);

			// add element thickness
			//
			if (element.thickness) {
				length += element.thickness;
			}

			// add element spacing
			//
			if (i < this.length - 1) {
				if (element.spacing) {
					length += element.spacing;
				}
			}
		}

		return length;
	},

	getOpticalLength: function() {

		// compute length of elements
		//
		let length = 0;
		for (let i = 0; i < this.length; i++) {
			let element = this.at(i);
			if (element instanceof Lens | element instanceof Stop) {

				// add element thickness
				//
				if (element.thickness) {
					length += element.thickness;
				}

				// add element spacing
				//
				if (i < this.length - 1) {
					let next = this.at(i + 1);
					if (!(next instanceof Sensor)) {
						if (element.spacing) {
							length += element.spacing;
						}
					}
				}
			}
		}

		return length;
	},

	getSize: function() {
		let aperture = this.getAperture();
		let length = this.getLength();
		return Math.max(aperture, length);
	},

	//
	// optical getting methods
	//

	getAngle: function(options) {
		let numberOfRays = options && options.number_of_rays? options.number_of_rays : 100;
		let paths = new Paths();

		// trace rays through elements
		//
		let rays = this.traceRays(this.getRays(numberOfRays), paths);

		// focus rays to a point
		//
		paths.focusTo(rays, this.getLength());

		// find first and last unobstructed paths
		//
		let first = paths[paths.next(0, function(path) {
			return !path.obstructed && !path.reflected;
		})];
		let last = paths[paths.prev(paths.length - 1, function(path) {
			return !path.obstructed && !path.reflected;
		})];

		// find points preceeding focus
		//
		let center = paths.focus? paths.focus : new Vector2(0, 0);
		let point1 = first? first.last(1) : center;
		let point2 = last? last.last(1) : center;

		// find direction vectors
		//	
		let direction1 = point1.minus(center);
		let direction2 = point2.minus(center);

		// find angle between first and last rays
		//
		return direction1 && direction2? direction2.angleTo(direction1) : undefined;
	},

	getFocalRatio: function() {
		let angle = this.getAngle();
		return 1 / Math.tan(angle / 2 * Math.PI / 180) / 2;
	},

	getFocalLength: function() {
		return this.getEntrancePupilDiameter(100) * this.getFocalRatio();
	},

	getBackFocalLength: function(options) {
		let totalTrackLength = this.getTotalTrackLength(options);

		if (totalTrackLength) {
			return totalTrackLength - this.getOpticalLength();
		}
	},

	getPaths: function(options) {
		let numberOfRays = options && options.number_of_rays? options.number_of_rays : 100;
		let paths = new Paths();

		// trace rays through elements
		//
		let rays = this.traceRays(this.getRays(numberOfRays), paths);

		// focus rays to a point
		//
		paths.focusTo(rays, this.getLength());

		return paths;
	},

	getTotalTrackLength: function(options) {
		let paths = this.getPaths(options);

		// return offset of focus
		//
		if (paths.focus) {
			return paths.focus.x;
		}
	},

	getEntrancePupilDiameter: function(options) {
		let paths = this.getPaths(options);

		// find first and last unobstructed paths
		//
		let first = paths[paths.next(0, function(path) {
			return !path.obstructed && !path.reflected;
		})];
		let last = paths[paths.prev(paths.length - 1, function(path) {
			return !path.obstructed && !path.reflected;
		})];

		// find distance between first and last rays
		//
		if (first && last) {
			return Math.abs(first[0].y - last[0].y);
		}
	},

	getExitPupilDistance: function() {
		let totalTrackLength = this.getValue('total_track_length');
		let focalLength = this.getValue('focal_length');
		return totalTrackLength - focalLength;
	},

	getPoints: function(numberOfRays) {
		let element = this.at(0);
		return element? element.getPoints(numberOfRays, {
			aperture: this.getAperture() * 0.99
		}) : undefined;
	},

	getRays: function(numberOfRays) {
		let rays = new Rays2();
		let points = this.getPoints(numberOfRays);
		if (points) {
			for (let i = 0; i < numberOfRays; i++) {
				rays.push(new Ray2(points[i], new Vector2(1, 0)));
			}
		}
		return rays;
	},

	getLimitingRays: function(first, last, wavelength) {
		if (!this.constructor.fractions) {
			this.constructor.fractions = this.constructor.getFractions(512);
		}

		// find two unobstructed rays
		//
		let i = 1;
		let unobstructed = [];
		let element = this.at(0);
		while (unobstructed.length < 2 && i < this.constructor.fractions.length) {
			let t = this.constructor.fractions[i];
			let ray = first.plus(last.minus(first).scaledBy(t));

			ray = this.traceRay(ray, new Vector2(0, 0), element, null, {
				wavelength: wavelength,
				depth: 0,
				max_depth: this.defaults['max-ray-depth']
			});
			if (ray) {
				unobstructed.push(ray);
			}
		}

		return unobstructed;
	},

	//
	// element querying methods
	//

	getElements: function(filter) {
		let elements = [];
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (!filter || filter(model)) {
				elements.push(model);
			}
		}
		return elements;
	},

	getLenses: function() {
		return this.getElements((element) => {
			return element instanceof Lens;
		});
	},

	getElementOffsetByIndex: function(index) {
		let offset = 0;
		for (let i = 0; i < index; i++) {
			let element = this.at(i);

			// advance element offset
			//
			if (element.has('thickness')) {
				offset += element.get('thickness').in('mm');
			}
			if (element.has('spacing')) {
				offset += element.get('spacing').in('mm');
			}
		}

		return offset;
	},

	getElementOffset: function(element) {
		return this.getElementOffsetByIndex(this.indexOf(element));
	},

	getElementSpacings: function() {
		let spacings = [];
		for (let i = 0; i < this.length; i++) {
			spacings.push(this.at(i).get('spacing'));
		}
		return spacings;
	},

	//
	// surface, stop, and sensor getting methods
	//

	getSurfaces: function() {
		let surfaces = new Surfaces();
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			surfaces.add(model.front);
			surfaces.add(model.back);
		}
		return surfaces;
	},

	getStops: function() {
		return this.getElements((element) => {
			return element instanceof Stop;
		});
	},

	getMount: function() {
		let stops = this.getStops();
		if (stops && stops.length > 0) {
			let stop = stops[stops.length - 1];
			let next = stop.next();
			if (next && next instanceof Sensor) {
				return stop;
			}
		}
	},

	getSensor: function() {
		let sensors = this.getSensors();
		if (sensors && sensors.length > 0) {
			return sensors[sensors.length - 1];
		}
	},

	getSensors: function() {
		return this.getElements((element) => {
			return element instanceof Sensor;
		});
	},

	//
	// material getting methods
	//

	getMaterials: function(filter) {
		let materials = [];
		for (let i = 0; i < this.length; i++) {
			let element = this.at(i);
			let material = element.material;
			if (material && (!filter || filter(material))) {
				materials.push(material);
			}
		}
		return materials;
	},

	getUniqueMaterials: function() {
		let materials = new Materials();
		return this.getMaterials((material) => {

			// find if material is unique
			//
			if (!materials.hasMaterial(material)) {
				materials.add(material);
				return true;
			} else {
				return false;
			}
		});
	},

	getUnloadedMaterials: function() {
		return this.getMaterials((material) => {
			return (!material.has('index_of_refraction'));
		});
	},

	getMaterialElementIndices: function(material) {
		let indices = [];
		if (material) {
			for (let i = 0; i < this.length; i++) {
				let model = this.at(i);
				if (material.matches(model.material)) {
					indices.push(i + 1);
				}
			}
		}
		return indices;
	},

	getMaterialLensIndices: function(material) {
		let indices = [];
		let index = 0;
		if (material) {
			for (let i = 0; i < this.length; i++) {
				let model = this.at(i);
				if (model instanceof Lens) {
					if (material.matches(model.material)) {
						indices.push(index + 1);
					}
					index++;
				}
			}
		}
		return indices;
	},

	//
	// element methods
	//

	flipAll: function() {
		let mount = this.getMount();
		let sensor = this.getSensor();
		let sensorSpacing, mountSpacing;

		// remove sensor
		//
		if (sensor) {
			sensorSpacing = sensor.prev().get('spacing');
			this.remove(sensor, {
				silent: true
			});
		}

		// remove mount
		//
		if (mount) {
			mountSpacing = mount.prev().get('spacing');
			this.remove(mount, {
				silent: true
			});
		}

		let elements = [];
		let spacings = this.getElementSpacings();

		// remove elements
		//
		let numElements = this.length;
		for (let i = 0; i < numElements; i++) {
			elements.push(this.remove(this.at(0), {
				silent: true
			}));
		}

		// flip elements
		//
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			if (element.flip) {
				element.flip({
					silent: false
				});
			}
		}

		// add elements
		//
		for (let i = 0; i < elements.length; i++) {
			let element = elements[i];
			this.add(element, {
				at: 0,
				silent: true
			});
		}

		// set element spacings
		//
		for (let i = 0; i < elements.length; i++) {
			let element = this.at(i);
			if (i < elements.length - 1) {
				let spacing = spacings[elements.length - i - 2];
				element.set('spacing', spacing, {
					silent: true
				});
			}
		}

		// add mount
		//
		if (mount) {
			this.add(mount, {
				silent: true
			});
			this.at(this.length - 2).set('spacing', mountSpacing, {
				silent: true
			});
		}

		// add sensor
		//
		if (sensor) {
			this.add(sensor, {
				silent: true
			});
			this.at(this.length - 2).set('spacing', sensorSpacing, {
				silent: true
			});
		}

		// update
		//
		for (let i = 0; i < this.length; i++) {
			this.at(i).trigger('change');
		}
		this.trigger('reorder');
	},

	first: function() {
		return this.at(0);
	},

	firstVisible: function() {
		let element = this.first();
		while (element && element.isSkipped()) {
			element = this.next(element);
		}
		return element;
	},

	prev: function(element, options) {
		if (options && options.wraparound) {
			let index = (this.indexOf(element) - 1 + this.length) % this.length;
			return this.at(index);
		} else {
			let index = this.indexOf(element);
			if (index > 0) {
				return this.at(index - 1);
			}
		}
	},

	next: function(element, options) {
		if (options && options.wraparound) {
			let index = (this.indexOf(element) + 1) % this.length;
			return this.at(index);
		} else {
			let index = this.indexOf(element);
			if (index < this.length - 1) {
				return this.at(index + 1);
			}
		}
	},

	nextVisible: function(ray, origin, element, options) {
		return this.skipHidden(ray, origin, element.next(), options);
	},

	skipHidden: function(ray, origin, element, options) {
		while (element && element.isSkipped()) {
			let x_offset = 0;

			if (element.thickness) {
				x_offset += element.thickness;
			}
			if (element.spacing) {
				x_offset += element.spacing;
			}

			// advance ray through element
			//
			if (origin) {
				origin.x += x_offset;
			}
			if (ray) {
				ray.location = ray.location.clone();
				ray.location.x -= x_offset;
			}

			// go to next element
			// 
			element = this.next(element, options);
		}

		return element;
	},

	//
	// material methods
	//

	loadMaterials: function(options) {
		let count = 0;
		for (let i = 0; i < this.length; i++) {
			let element = this.at(i);
			if (element.material && !element.material.isSet()) {
				count++;
				element.loadMaterial({

					// callbacks
					//
					success: () => {

						// check if finished
						//
						count--;
						if (count == 0) {

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
						}
					},
					error: () => {

						// check if finished
						//
						count--;
						if (count == 0) {

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
						}
					}
				});
			}
		}

		if (count == 0) {

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}	
		}
	},

	//
	// ray tracing methods
	//

	traceRay: function(ray, origin, element, fromMaterial, options) {

		// skip hidden elements
		//
		element = this.skipHidden(ray, origin, element, options);
		if (element) {
			return element.traceRay(ray, origin, fromMaterial, options);
		} else {
			return ray;
		}
	},

	traceRayThrough: function(ray, origin, element, toMaterial, options) {

		// skip hidden elements
		//
		element = this.skipHidden(ray, origin, element, options);
		if (element) {
			return element.traceRayThrough(ray, origin, toMaterial, options);
		} else {
			return ray;
		}
	},

	traceRays: function(rays, paths, normals, wavelength, extension) {
		let element = this.at(0);

		// trace rays through elements
		//
		for (let i = 0; i < rays.length; i++) {
			let ray = rays[i];

			if (paths) {
				paths[i] = new Path(ray.location);
			}
			if (normals) {
				normals[i] = [];
			}

			let traced = this.traceRay(ray, new Vector2(0, 0), element, null, {
				path: paths? paths[i] : null, 
				normals: normals? normals[i] : null,
				wavelength: wavelength,
				depth: 0,
				max_depth: this.defaults['max-ray-depth']
			});

			if (traced) {
				rays[i] = traced;
			} else {
				rays[i] = ray.scaledTo(extension);
			}
		}

		return rays;
	}
}, {

	//
	// static attributes
	//

	fractions: [],

	//
	// static methods
	//

	parseElement: function(object) {
		switch (object.type) {
			case 'element':
				return Lens.parse(object);
			case 'stop':
				return Stop.parse(object);
			case 'sensor':
				return Sensor.parse(object);
		}
	},

	parse: function(objects) {
		let elements = [];

		// parse elements
		//
		if (objects) {
			for (let i = 0; i < objects.length; i++) {
				elements.push(this.parseElement(objects[i]));
			}
		}

		// create collection
		//
		return new this.prototype.constructor(elements);
	},

	//
	// limiting ray utilities
	//

	getFractions: function(limit) {
		if (this.fractions) {
			return this.fractions;
		}

		function toBinary(decimal) {
			return (decimal >>> 0).toString(2);
		}

		function toLength(string, length) {
			let prefix = '';
			for (let k = string.length; k < length; k++) {
				prefix += '0';
			}
			return prefix + string;
		}

		function toValue(string) {
			let value = 0;
			let placeValue = 1;
			for (let i = 0; i < string.length; i++) {
				if (string[i] == '1') {
					value += placeValue;
				}
				placeValue *= 2;
			}
			return value;
		}

		let digits = Math.ceil(Math.log2(limit));
		let values = [];
		let count = 0;
		while (values.length < limit) {
			let binary = toLength(toBinary(count), digits);
			let value = toValue(binary);
			if (value < limit) {
				values.push(value / limit);
			}
			count++;
		}

		return values;
	}
});