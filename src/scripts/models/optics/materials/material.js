/******************************************************************************\
|                                                                              |
|                                  material.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of an optical (refractive) material.           |                                         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';
import File from '../../../models/storage/files/file.js';
import AbbeEquation from '../../../models/optics/materials/equations/abbe-equation.js';
import CauchyEquation from '../../../models/optics/materials/equations/cauchy-equation.js';
import SellmeierEquation from '../../../models/optics/materials/equations/sellmeier-equation.js';
import Sellmeier2Equation from '../../../models/optics/materials/equations/sellmeier2-equation.js';
import PolynomialEquation from '../../../models/optics/materials/equations/polynomial-equation.js';
import ColorScheme from '../../../models/optics/materials/color-scheme.js';
import LightUtils from '../../../utilities/optics/light-utils.js';
import SpectralLines from '../../../utilities/optics/spectral-lines.js';
import Units from '../../../utilities/math/units.js';
import Yaml from '../../../../library/js-yaml/js-yaml.js';
import '../../../utilities/math/math-utils.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		name: undefined,
		catalog: undefined,

		// physics attributes
		//
		index_of_refraction: undefined,
		abbe_number: undefined
	},

	//
	// constructor
	//

	initialize: function(attributes) {

		// set is attribute
		//
		this.set({
			id: ++this.constructor.count
		});

		// set formula equation
		//
		if (attributes) {
			this.setEquation(attributes);
		}
	},

	//
	// converting methods
	//

	toString: function() {
		if (this.isNamed()) {

			// return name
			//
			if (this.has('catalog')) {
				return this.get('catalog') + '/' + this.get('name');
			}
			return this.get('name');
		} else {
			let index_of_refraction = this.get('index_of_refraction');
			let abbe_number = this.get('abbe_number');

			// return values
			//
			if (index_of_refraction && abbe_number) {
				return "n=" + index_of_refraction.toPrecision(3) + 
					', v=' + abbe_number.toPrecision(3);
			} else if (index_of_refraction) {
				return "n=" + index_of_refraction.toPrecision(3);
			}
		}
	},

	toObject: function() {

		// check if material was loaded from catalog
		//
		if (this.isLoaded()) {

			// return name
			//
			return (this.has('catalog')? this.get('catalog') + '/' : '') + this.get('name');
		} else {

			// return object
			//
			let index_of_refraction = this.get('index_of_refraction');
			let abbe_number = this.get('abbe_number');
			let object = {
				n: index_of_refraction,
				v: abbe_number
			};

			// add optional attributes
			//
			if (this.has('catalog')) {
				object.catalog = this.get('catalog');
			}
			if (this.has('name')) {
				object.name = this.get('name');
			}

			return object;
		}
	},

	//
	// querying methods
	//

	isSameAs: function(model) {
		return model && this.get(this.idAttribute) == model.get(model.idAttribute);
	},

	isNamed: function() {
		return this.has('name') && this.get('name') != '';
	},

	isLoaded: function() {
		return this.loaded;
	},

	isSet: function() {
		return this.has('index_of_refraction') && this.get('index_of_refraction') != 0;	
	},

	matches: function(material) {
		return material && this.getIndexOfRefraction() == material.getIndexOfRefraction() &&
			this.getAbbeNumber() == material.getAbbeNumber();
	},

	//
	// optic querying methods
	//

	isRefractive: function() {
		return this.has('index_of_refraction') || this.has('formula');
	},

	isReflective: function() {
		return true;
	},

	isTransmissive: function() {
		return this.has('k');
	},

	//
	// getting methods
	//

	getName: function() {
		return this.has('name')? this.get('name').replace('.' + this.constructor.extension, '') : undefined
	},

	getPath: function() {
		let catalog = this.has('catalog')? this.get('catalog').toTitleCase() : undefined;
		let name = this.get('name');

		if (catalog) {
			return this.constructor.path + '/' + catalog + '/' + name + '.' + this.constructor.extension;
		} else {
			return name;
		}
	},

	getColor: function() {
		if (ColorScheme.current) {
			return ColorScheme.current.getColorOf(this);
		}
	},

	getIndexOfRefraction: function(wavelength) {
		if (this.equation) {
			return this.equation.eval(wavelength || SpectralLines.sodium.D);
		} else if (this.has('n')) {
			return this.getTabulatedIndex(wavelength || SpectralLines.sodium.D);
		} else {
			return 1;
		}
	},

	getTabulatedIndex: function(wavelength) {
		let lambda = wavelength.in('um');
		let n = this.get('n');
		let minLambda = n[0][0];
		let minIndex = n[0][1];
		let maxLambda = null;
		let maxIndex = null;

		for (let i = 0; i < n.length; i++) {
			let nLambda = n[i][0];
			let nIndex = n[i][1];

			if (nLambda < lambda) {
				minLambda = nLambda;
				minIndex = nIndex;
			}
			if (nLambda > lambda && maxLambda == null) {
				maxLambda = nLambda;
				maxIndex = nIndex;
			}
		}
		if (!maxIndex) {
			maxLambda = n[n.length - 1][0];
			maxIndex = n[n.length - 1][1];
		}

		// interpolate between min and max
		//
		let t = (lambda - minLambda) / (maxLambda - minLambda);
		return minIndex + (maxIndex - minIndex) * t;
	},

	getAbbeNumber: function(wavelengths) {

		// default to F, D, C lines
		//
		if (!wavelengths) {
			wavelengths = this.constructor.abbeWavelengths['D'];
		}

		let nd = this.getIndexOfRefraction(wavelengths.d || wavelengths.e);
		let nF = this.getIndexOfRefraction(wavelengths.F);
		let nC = this.getIndexOfRefraction(wavelengths.C);

		if (nd && nF && nC) {
			return (nd - 1) / (nF - nC);
		} else {
			return 1;
		}
	},

	getGlassCode: function() {
		let indexOfRefraction = this.getIndexOfRefraction(SpectralLines.sodium.D);
		let abbeNumber = this.getAbbeNumber();
		if (indexOfRefraction && abbeNumber) {
			let indexCode = Math.round((indexOfRefraction - 1) * 1000).toString();
			let abbeCode = Math.round(abbeNumber * 10).toString();
			return indexCode + abbeCode;
		}
	},

	getReflectance: function(angle, medium, options) {

		// set optional parameter defaults
		//
		let polarization = options && options.polarization? options.polarization : 'unpolarized';
		let surface = options && options.interface? options.interface : 'external';
		let wavelength = options && options.wavelength? options.wavelength : SpectralLines.sodium.D;
		let n1, n2;

		switch (surface) {
			case 'external':
				n1 = medium? medium.getIndexOfRefraction(wavelength) : 1;
				n2 = this.getIndexOfRefraction(wavelength);
				break;
			case 'internal':
				n1 = this.getIndexOfRefraction(wavelength);
				n2 = medium? medium.getIndexOfRefraction(wavelength) : 1;
				break;
		}

		return LightUtils.fresnelReflectance(n1, n2, angle.in('deg'), polarization);
	},

	getCriticalAngle: function(medium, options) {

		// set optional parameter defaults
		//
		let wavelength = options && options.wavelength? options.wavelength : SpectralLines.sodium.D;

		// get indices of refraction
		//
		let n1 = medium? medium.getIndexOfRefraction(wavelength) : 1;
		let n2 = this.getIndexOfRefraction(wavelength);

		return Math.asin(n1 / n2) * 180 / Math.PI;
	},

	getBrewstersAngle: function(medium, options) {

		// set optional parameter defaults
		//
		let wavelength = options && options.wavelength? options.wavelength : SpectralLines.sodium.D;

		// get indices of refraction
		//
		let n1 = medium? medium.getIndexOfRefraction(wavelength) : 1;
		let n2 = this.getIndexOfRefraction(wavelength);

		return Math.atan(n2 / n1) * 180 / Math.PI;
	},

	getK: function(wavelength) {
		let k = this.get('k');
		if (k && k.length > 0) {
			let lambda = wavelength.as('um').val();

			// check if wavelength in range
			//
			let minWavelength = k[0][0];
			if (lambda < minWavelength) {
				return k[0][1];
			}
			let maxWavelength = k[k.length - 1][0];
			if (lambda > maxWavelength) {
				return k[k.length - 1][1];
			}

			// find min and max wavelengths
			//
			let i = 0;
			while (i < k.length) {
				if (lambda < k[i][0] || i > k.length - 1) {
					break;
				} else {
					i++;
				}
			}

			let lowWavelength = k[i - 1][0];
			let lowK = k[i - 1][1];
			let highWavelength = k[i][0];
			let highK = k[i][1];

			return lowK + (highK - lowK) * (lambda - lowWavelength) / (highWavelength - lowWavelength);
		} else {
			return undefined;
		}
	},

	getAbsorption: function(thickness, wavelength, units) {
		let k = this.getK(wavelength || SpectralLines.sodium.D);
		if (k) {
			return new Units(LightUtils.absorptionCoefficient(k, wavelength || SpectralLines.sodium.D, units), units + '^-1');
		} else {
			return new Units(0, units + '^-1');
		}
	},

	getTransmission: function(thickness, wavelength) {
		let k = this.getK(wavelength);
		if (k) {
			return LightUtils.beerLambertTransmission(k, thickness, wavelength);
		} else {
			return 0;
		}
	},

	//
	// setting methods
	//

	setEquation: function(attributes) {
		switch (attributes.formula || 'abbe') {
			case 'abbe':
				this.equation = new AbbeEquation(attributes);
				break;
			case 'cauchy':
				this.equation = new CauchyEquation(attributes.coeffs);
				break;
			case 'sellmeier':
				this.equation = new SellmeierEquation(attributes.coeffs);
				break;
			case 'sellmeier2':
				this.equation = new Sellmeier2Equation(attributes.coeffs);
				break;
			case 'polynomial':
				this.equation = new PolynomialEquation(attributes.coeffs);
				break;
			case 'tabulated':
				this.equation = null;
				break;
		}
	},

	//
	// updating methods
	//

	update: function() {
		this.color = ColorScheme.current.getColor(this);
	},

	//
	// loading methods
	//

	load: function(options) {
		let self = this;
		let name = this.getName();
		let catalog = this.get('catalog');
		let path = this.getPath();
		let caching = false;

		if (!this.constructor.directory[name] || !caching) {
			new File({
				path: path
			}).read({

				// callbacks
				//
				success: function(text) {

					// save file contents
					//
					if (!self.constructor.directory[name]) {
						self.constructor.directory[name] = text;
					}

					// set material catalog
					//
					options.catalog = catalog;
					options.loaded = true;

					// parse file contents
					//
					self.constructor.parseYaml(name, text, options);
				},

				error: function() {

					// perform callback
					//
					if (options && options.error) {
						options.error(this);
					}
				}
			});
		} else {

			// lookup file contents
			//
			let text = this.constructor.directory[name];

			// parse file contents
			//
			this.constructor.parseYaml(name, text, options);
		}
	}
}, {

	//
	// static attributes
	//

	count: 0,
	extension: 'mtrl',
	path: config.apps.material_editor.materials_directory,
	directory: {},

	abbeWavelengths: {
		D: {
			d: SpectralLines.helium.d,
			F: SpectralLines.hydrogen.F,
			C: SpectralLines.hydrogen.C
		},

		e: {
			e: SpectralLines.mercury.e,
			F: SpectralLines.cadmium.F1,
			C: SpectralLines.cadmium.C1
		}
	},

	//
	// static methods
	//

	parse: function(attributes) {
		if (!attributes) {
			return;
		}

		return new this.prototype.constructor({
			name: attributes.name,
			catalog: attributes.catalog,
			index_of_refraction: attributes.n, 
			abbe_number: attributes.v
		});
	},

	parseFormula: function(data) {
		if (!data) {
			return;
		}
		for (let i = 0; i < data.length; i++) {
			switch (data[i].type) {
				case 'formula 1':
					return 'sellmeier2';
				case 'formula 2':
					return 'sellmeier';
				case 'formula 3':
					return 'polynomial';
				case 'formula 5':
					return 'cauchy';
				case 'tabulated n':
					return 'tabulated';
			}
		}
	},

	parseCoeffs: function(data) {
		if (!data) {
			return;
		}
		for (let i = 0; i < data.length; i++) {
			if (data[i] && data[i].type.startsWith('formula')) {

				// parse terms
				//
				let terms = data[i].coefficients.split(' ');
				for (let i = 0; i < terms.length; i++) {
					terms[i] = parseFloat(terms[i]);
				}

				// set coeffs
				//
				let coeffs = [];
				if (terms[0] == 0) {
					for (let i = 1; i < terms.length; i++) {
						coeffs.push(terms[i]);
					}
				} else {
					for (let i = 0; i < terms.length; i++) {
						if (i == 1) {
							coeffs.push(0);
						}
						coeffs.push(terms[i]);
					}
				}

				return coeffs;
			}
		}
	},

	parseRefraction: function(data) {
		if (!data) {
			return;
		}
		for (let i = 0; i < data.length; i++) {
			if (data[i] && data[i].type == 'tabulated n') {
				let array = data[i].data.split('\n');
				let n = [];
				for (let i = 0; i < array.length - 1; i++) {
					let terms = array[i].split(' ');
					let wavelength = parseFloat(terms[0]);
					let value = parseFloat(terms[1]);
					n.push([wavelength, value]);
				}
				return n;
			}
		}
	},

	parseTransmission: function(data) {
		if (!data) {
			return;
		}
		for (let i = 0; i < data.length; i++) {
			if (data[i] && data[i].type == 'tabulated k') {
				let array = data[i].data.split('\n');
				let k = [];
				for (let i = 0; i < array.length - 1; i++) {
					let terms = array[i].split(' ');
					let wavelength = parseFloat(terms[0]);
					let value = parseFloat(terms[1]);
					k.push([wavelength, value]);
				}
				return k;
			}
		}
	},

	parseWavelengthRange: function(data) {
		if (!data) {
			return;
		}
		for (let i = 0; i < data.length; i++) {
			if (data[i] && data[i].wavelength_range) {
				return {
					min: new Units(parseFloat(data[i].wavelength_range.split(' ')[0]), 'um'),
					max: new Units(parseFloat(data[i].wavelength_range.split(' ')[1]), 'um')
				};
			}
		}
	},

	parseThermalExpansion: function(expansion) {
		if (expansion) {
			return {
				min: expansion[0],
				max: expansion[1]
			};
		}
	},

	parseYaml: function(name, text, options) {
		let self = this;
		Yaml.loadAll(text, (attributes) => {

			// perform callback
			//
			if (options && options.success) {
				options.success(new self.prototype.constructor({
					loaded: options.loaded,

					// info
					//
					name: name,
					catalog: options.catalog,
					description: attributes.DESCRIPTION? attributes.DESCRIPTION.trim() : undefined,

					// metadata
					//
					references: attributes.REFERENCES? attributes.REFERENCES.trim() : undefined,
					comments: attributes.COMMENTS? attributes.COMMENTS.trim() : undefined,

					// attributes
					//
					formula: this.parseFormula(attributes.DATA),
					coeffs: this.parseCoeffs(attributes.DATA),
					n: this.parseRefraction(attributes.DATA),
					k: this.parseTransmission(attributes.DATA),
					wavelength_range: this.parseWavelengthRange(attributes.DATA),

					// specifications
					//
					glass_code: attributes.SPECS? attributes.SPECS.glass_code : undefined, 
					glass_status: attributes.SPECS? attributes.SPECS.glass_status : undefined, 
					index_of_refraction: attributes.SPECS? attributes.SPECS.nd : undefined, 
					abbe_number: attributes.SPECS? attributes.SPECS.Vd : undefined,
					temperature: attributes.SPECS? attributes.SPECS.temperature : undefined,
					density: attributes.SPECS? attributes.SPECS.density : undefined,
					dpgf: attributes.SPECS? attributes.SPECS.dPgF : undefined,
					thermal_expansion: attributes.SPECS? this.parseThermalExpansion(attributes.SPECS.thermal_expansion) : undefined,

					// environmental
					//
					climatic_resistance: attributes.SPECS? attributes.SPECS.climatic_resistance : undefined,
					stain_resistance: attributes.SPECS? attributes.SPECS.stain_resistance : undefined,
					acid_resistance: attributes.SPECS? attributes.SPECS.acid_resistance : undefined,
					alkali_resistance: attributes.SPECS? attributes.SPECS.alkali_resistance : undefined,
					phosphate_resistance: attributes.SPECS? attributes.SPECS.phosphate_resistance : undefined
				}));
			}
		});
	}
});