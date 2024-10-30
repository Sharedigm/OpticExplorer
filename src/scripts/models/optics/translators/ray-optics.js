/******************************************************************************\
|                                                                              |
|                                ray-optics.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains utilities for importing / exporting .roa files.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DistantLight from '../../../models/optics/lights/distant-light.js';
// import Planar from '../../../models/optics/elements/surfaces/planar.js';
// import Spherical from '../../../models/optics/elements/surfaces/spherical.js';
import Lens from '../../../models/optics/elements/lens.js';
// import Stop from '../../../models/optics/elements/stop.js';
import Optics from '../../../models/optics/optics.js';
import Elements from '../../../collections/optics/elements/elements.js';
import Lights from '../../../collections/optics/lights/lights.js'
import Units from '../../../utilities/math/units.js';
import Yaml from '../../../../library/js-yaml/js-yaml.js';

export default {

	//
	// getting methods
	//

	getDefaultLightDistance: function(elements) {
		let distance = elements.getRadius() / 2;

		// clamp to nearest 10mm
		//
		return Math.ceil(distance / 10) * 10;
	},

	//
	// importing methods
	//

	importElements: function(object) {
		let elements = [];
		let units = 'mm';

		// get models
		//
		let optical_model = object.optical_model;
		let seq_model = object.optical_model.attributes.seq_model;

		// get model dictionaries
		//
		let part_tree = optical_model.attributes.part_tree;
		let profile_dict = optical_model.attributes.profile_dict;

		// iterate over part tree
		//
		let parts = part_tree.attributes.root_node.children;
		for (let i = 0; i < parts.length; i++) {
			let part = parts[i];

			if (part.tag == '#element#lens') {

				// parse front surface
				//
				let front = part.children[0];
				let front_profile = profile_dict[front.id_key];
				let front_curvature = front_profile.attributes.cv;
				let front_ifc_name = front.children[0].name;
				let front_ifc_index = parseInt(front_ifc_name.replace('i', ''));
				let front_ifc = seq_model.attributes.ifcs[front_ifc_index];
				let front_aperture = front_ifc.attributes.max_aperture * 2;

				// parse back surface
				//
				let back = part.children[2];
				let back_profile = profile_dict[back.id_key];
				let back_curvature = back_profile.attributes.cv;
				let back_ifc_name = back.children[0].name;
				let back_ifc_index = parseInt(back_ifc_name.replace('i', ''));
				let back_ifc = seq_model.attributes.ifcs[back_ifc_index];
				let back_aperture = back_ifc.attributes.max_aperture * 2;

				// parse thickness
				//
				let middle = part.children[1];
				let gap_name = middle.children[0].name;
				let gap_index = parseInt(gap_name.replace('g', ''));
				let gap = seq_model.attributes.gaps[gap_index];
				let thickness = gap.attributes.thi;

				// parse spacing
				//
				let gap2 = seq_model.attributes.gaps[gap_index + 1];
				let spacing = gap2.attributes.thi;

				// parse material
				//
				let material = gap.attributes.medium.attributes.gname;

				// parse surfaces
				//
				let frontSurface, backSurface;
				if (front_curvature == 0) {
					frontSurface = {
						type: 'planar',
						diameter: (front_aperture) + ' ' + units
					};
				} else {
					frontSurface = {
						type: 'spherical',
						diameter: (front_aperture) + ' ' + units,
						curvature: (1 / front_curvature) + ' ' + units
					};
				}
				if (back_curvature == 0) {
					backSurface = {
						type: 'planar',
						diameter: (back_aperture) + ' ' + units
					};
				} else {
					backSurface = {
						type: 'spherical',
						diameter: (back_aperture) + ' ' + units,
						curvature: (1 / back_curvature) + ' ' + units
					};
				}

				// add element to list
				//
				elements.push(Lens.parse({
					surfaces: [frontSurface, backSurface],
					thickness: thickness + ' ' + units,
					spacing: spacing + ' ' + units,
					material: material? 'Schott/' + material : {
						n: 1.5,
						v: 50
					}
				}));
			}
		}

		return new Elements(elements);
	},

	importOptics: function(text, options) {

		// replace tokens to make valid json
		//
		text = text.replace('Infinity', '"Infinity"');
		text = text.replace('-"Infinity"', '"-Infinity"');

		Yaml.loadAll(text, (object) => {
			let elements = this.importElements(object);

			// add default distant light
			//
			let lights = new Lights([new DistantLight({
				distance: new Units(this.getDefaultLightDistance(elements), 'mm'),
				angle: new Units(0, 'deg')
			})]);

			// perform callback
			//
			let optics = new Optics({
				name: name,
				elements: elements,
				lights: lights
			});

			// load dependencies
			//
			optics.load(options);
		});
	},

	//
	// exporting methods
	//

	/*
	exportPlanar: function(surface, options) {
	},

	exportSpherical: function(surface, options) {
	},

	exportSurface: function(surface, options) {
		if (surface instanceof Planar) {
			return this.exportPlanar(surface, options);
		} else if (surface instanceof Spherical) {
			return this.exportSpherical(surface, options);
		}
	},

	exportLens: function(lens, options) {
		let lines = [];

		// front surface
		//
		lines = lines.concat(this.exportSurface(lens.get('front'), options));
		options.index++;

		// back surface
		//
		lines = lines.concat(this.exportSurface(lens.get('back'), options));
		options.index++;

		return lines;
	},

	exportStop: function(element, options) {
	},

	exportElement: function(element, options) {
		if (element instanceof Lens) {
			return this.exportLens(element, options);
		} else if (element instanceof Stop) {
			return this.exportStop(element, options);
		}
	},

	exportElements: function(elements, options) {
		let units = options && options.units? options.units : 'mm';

		let lines = [];
		let index = 0;
		for (let i = 0; i < elements.length; i++) {
			let element = elements.at(i);

			// add lines
			//
			lines = lines.concat(this.exportElement(element, {
				index: index,
				units: units
			}));

			// update index
			//
			if (element instanceof Lens) {
				index += 2;
			} else if (element instanceof Stop) {
				index += 1;
			}
		}

		return lines;
	},
	*/

	exportOptics: function(optics, options) {
		let lines = [];
		// let name = options && options.name? options.name : 'Untitled';
		// let units = options && options.units? options.units : 'mm';

		// add element lines
		//
		lines = lines.concat(this.exportElements(optics.elements, options));

		// join lines
		//
		return lines.join('\n');
	},
}