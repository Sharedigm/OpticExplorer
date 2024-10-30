/******************************************************************************\
|                                                                              |
|                                   zemax.js                                   |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This contains utilities for importing / exporting .zmx files.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import DistantLight from '../../../models/optics/lights/distant-light.js';
import Planar from '../../../models/optics/elements/surfaces/planar.js';
import Spherical from '../../../models/optics/elements/surfaces/spherical.js';
import Lens from '../../../models/optics/elements/lens.js';
import Stop from '../../../models/optics/elements/stop.js';
import Optics from '../../../models/optics/optics.js';
import Elements from '../../../collections/optics/elements/elements.js';
import Lights from '../../../collections/optics/lights/lights.js'
import Units from '../../../utilities/math/units.js';

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

	importElements: function(text) {
		let elements = [];
		let lines = text.split('\n');
		let i = 0;
		let catalog = undefined, units = 'mm';
		let notes = [];
		let prevDisz, prevGlass, prevSurface;

		// parse lines
		//
		while (i < lines.length) {
			let line = lines[i++];

			// split line by whitespace
			//
			let words = line.split(/\b\s+/);

			switch (words[0]) {

				// parse catalog
				//
				case 'NOTE':
					notes.push(line.substring(4).trim());
					break;

				// parse catalog
				//
				case 'GCAT':
					catalog = words[1].trim().toLowerCase().toTitleCase();
					break;

				case 'UNIT':
					units = words[1].trim().toLowerCase();
					break;

				// parse surface
				//
				case 'SURF': {
					let curv, diam, disz, glass, surface, stop;

					line = lines[i++];
					while (line && line.startsWith(' ')) {

						// split line by whitespace
						//
						let words = line.trim().split(/\b\s+/);

						switch (words[0]) {

							// parse surface attributes
							//
							case 'STOP':
								stop = true;
								break;
							case 'CURV':
								curv = words[1] != 'INFINITY'? parseFloat(words[1]) : Infinity;
								break;
							case 'DIAM':
								diam = Math.abs(parseFloat(words[1]));
								break;

							// parse lens attributes
							//
							case 'DISZ':
								disz = words[1] != 'INFINITY'? Math.abs(parseFloat(words[1])) : Infinity;
								break;
							case 'GLAS':
								glass = {
									name: words[1] != '___BLANK'? words[1] : null,
									catalog: catalog,
									n: words[4]? parseFloat(words[4]) : undefined,
									v: words[5]? parseFloat(words[5]) : undefined
								};
								break;
						}

						line = lines[i++];

						// skip blank lines
						//
						while (line && line.trim() == '') {
							line = lines[i++];
						}
					}

					// create new surface
					//
					if (diam && disz != Infinity) {
						if (stop && !glass) {

							// add new stop
							//
							elements.push(Stop.parse({
								diameter: (diam * 3) + ' ' + units,
								aperture: (diam * 2) + ' ' + units,
								spacing: (disz || 0) + ' ' + units
							}));
						} else {

							// add new planar surface
							//
							if (curv == 0) {
								surface = {
									type: 'planar',
									diameter: (diam * 2) + ' ' + units
								};

							// add new spherical surface
							//
							} else {

								// check to make sure that radius is valid
								//
								if (curv) {
									let radius_of_curvature = 1 / curv;
									if (diam && diam > Math.abs(radius_of_curvature)) {
										diam = Math.abs(radius_of_curvature);

										// add a bit of margin
										//
										diam *= 0.9;
									}
								}

								surface = {
									type: 'spherical',
									diameter: (diam * 2) + ' ' + units,
									curvature: (1 / curv) + ' ' + units
								};
							}

							if (surface && prevSurface && prevGlass) {

								// add new lens
								//
								if (glass) {
									elements.push(Lens.parse({
										surfaces: [prevSurface, surface],
										thickness: prevDisz + ' ' + units,
										material: prevGlass
									}));
								} else {
									elements.push(Lens.parse({
										surfaces: [prevSurface, surface],
										thickness: prevDisz + ' ' + units,
										spacing: disz + ' ' + units,
										material: prevGlass
									}));								
								}
							}

							prevDisz = disz;
							prevGlass = glass;
							prevSurface = surface;
						}
					}

					// return to current line
					//
					line = lines[i--];
					break;
				}
			}
		}

		// create collection
		//
		return new Elements(elements);
	},

	importOptics: function(text, options) {
		let elements = this.importElements(text);

		// add default distant light
		//
		let lights = new Lights([new DistantLight({
			distance: new Units(this.getDefaultLightDistance(elements), 'mm'),
			angle: new Units(0, 'deg')
		})]);

		// create optics
		//
		let optics = new Optics({
			name: options.name,
			elements: elements,
			lights: lights
		});

		// load dependencies
		//
		optics.load(options);
	},

	//
	// exporting methods
	//

	exportMaterial: function(material) {

		// get material attributes
		//
		let materialName = material.has('name')? material.get('name') : 'Untitled';
		let indexOfRefraction = material.has('index_of_refraction')? material.get('index_of_refraction') : 1;
		let abbeNumber = material.has('abbe_number')? material.get('abbe_number') : 50;

		// format
		//
		return 'GLAS ' + materialName + ' 1 2 ' + indexOfRefraction + ' ' + abbeNumber;
	},

	exportPlanar: function(surface, options) {
		let lines = [];
		let index = options && options.index? options.index : 0;
		let units = options && options.units? options.units : 'mm';

		// get surface attributes
		//
		let curvature = 0;
		let diameter = surface.get('diameter').in(units) / 2;

		// get lens attributes
		//
		let thickness = surface.parent.get('thickness').in(units);
		let spacing = surface.parent.has('spacing')? surface.parent.get('spacing').in(units) : 0;
		let material = surface.parent.get('material');

		// add lines
		//
		lines.push('SURF ' + index);
		switch (surface.getSide()) {
			case 'front':
				lines.push('  CURV ' + curvature);
				lines.push('  DISZ ' + thickness);
				lines.push('  DIAM ' + diameter);
				lines.push('  ' + (material? this.exportMaterial(material) : '___BLANK'));
				break;
			case 'back':
				lines.push('  CURV ' + curvature);
				lines.push('  DIAM ' + diameter);
				lines.push('  DISZ ' + spacing);
				break;
		}

		return lines;
	},

	exportSpherical: function(surface, options) {
		let lines = [];
		let index = options && options.index? options.index : 0;
		let units = options && options.units? options.units : 'mm';

		// get surface attributes
		//
		let curvature = 1 / surface.get('radius_of_curvature').in(units);
		let diameter = surface.get('diameter').in(units) / 2;

		// get lens attributes
		//
		let thickness = surface.parent.get('thickness').in(units);
		let spacing = surface.parent.has('spacing')? surface.parent.get('spacing').in(units) : 0;
		let material = surface.parent.get('material');

		// add lines
		//
		lines.push('SURF ' + index);
		switch (surface.getSide()) {
			case 'front':
				lines.push('  TYPE STANDARD');
				lines.push('  CURV ' + curvature);
				lines.push('  DISZ ' + thickness);
				lines.push('  DIAM ' + diameter);
				lines.push('  ' + (material? this.exportMaterial(material) : '___BLANK'));
				break;
			case 'back':
				lines.push('  TYPE STANDARD');
				lines.push('  CURV ' + curvature);
				lines.push('  DIAM ' + diameter);
				lines.push('  DISZ ' + spacing);
				break;
		}

		return lines;
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
		let lines = [];
		let index = options && options.index? options.index : 0;
		let units = options && options.units? options.units : 'mm';

		// get attributes
		//
		let diameter = element.get('aperture').in(units) / 2;
		let spacing = element.get('spacing').in(units);

		// format lines
		//
		lines.push('SURF ' + index);
		lines.push('  STOP');
		lines.push('  CURV 0.0 0 0 0 0 ');
		lines.push('  DIAM ' + diameter);
		lines.push('  DISZ ' + spacing);

		return lines;
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

	exportOptics: function(optics, options) {
		let lines = [];
		let name = options && options.name? options.name : 'Untitled';
		let units = options && options.units? options.units : 'mm';

		// add header lines
		//
		lines.push('MODE SEQ');
		lines.push('NAME ' + name);
		lines.push('GCAT SCHOTT');
		lines.push('UNIT ' + units.toUpperCase());

		// add element lines
		//
		lines = lines.concat(this.exportElements(optics.elements, options));

		// join lines
		//
		return lines.join('\n');
	}
}