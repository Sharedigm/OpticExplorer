/******************************************************************************\
|                                                                              |
|                                  spectrum.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a light's emission spectrum.                |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';
import File from '../../../models/storage/files/file.js';
import LightUtils from '../../../utilities/optics/light-utils.js';
import Units from '../../../utilities/math/units.js';
import Yaml from '../../../../library/js-yaml/js-yaml.js';

export default BaseModel.extend({

	//
	// attributes
	//

	defaults: {
		name: undefined,
		catalog: undefined,

		// physics attributes
		//
		wavelengths: undefined,
		weights: undefined,
		primary: undefined
	},

	//
	// counting methods
	//

	numWavelengths: function() {
		if (this.has('wavelengths')) {
			return this.get('wavelengths').length;
		} else {
			return 0;
		}
	},

	//
	// querying methods
	//

	isMultispectral: function() {
		return this.numWavelengths() > 1;
	},

	isLoaded: function() {
		return this.has('wavelengths');
	},

	//
	// getting methods
	//

	getPath: function() {
		let catalog = this.has('catalog')? this.get('catalog').toTitleCase() : undefined;
		let name = this.get('name');

		if (catalog) {
			return this.constructor.path + '/' + catalog + '/' + name + '.' + this.constructor.extension;
		} else {
			return this.constructor.path + '/' + name + '.' + this.constructor.extension;
		}
	},

	getColor: function() {
		if (!this.isMultispectral()) {
			let wavelengths = this.get('wavelengths');
			let primary = this.get('primary') || 0;
			let wavelength = wavelengths[primary];
			return LightUtils.wavelengthToColor(wavelength);
		}
	},

	getColors: function() {
		let wavelengths = this.get('wavelengths');
		return LightUtils.wavelengthsToColors(wavelengths, 1);
	},

	getRgbaColors: function() {
		let colors = [];
		let wavelengths = this.get('wavelengths');
		let weights = this.get('weights');
		for (let i = 0; i < wavelengths.length; i++) {
			let wavelength = wavelengths[i];
			let alpha = (weights? weights[i] : 1) / (wavelengths.length / 3);
			colors.push(LightUtils.wavelengthToColor(wavelength, alpha));
		}
		return colors;
	},

	//
	// converting methods
	//

	toString: function() {
		return (this.has('catalog')? this.get('catalog') + '/' : '') + this.get('name');
	},

	//
	// loading methods
	//

	load: function(options) {
		let self = this;

		new File({
			path: this.getPath()
		}).read({

			// callbacks
			//
			success: function(text) {
				self.parseYaml(text, options);
			},

			error: function() {

				// perform callback
				//
				if (options && options.error) {
					options.error(this);
				}
			}
		});
	},

	parseYaml: function(text, options) {
		let self = this;
		Yaml.loadAll(text, (attributes) => {
			self.set({
				description: attributes.DESCRIPTION,
				wavelengths: Units.arrayToUnits(attributes.WAVELENGTHS, 'nm'),
				weights: attributes.WEIGHTS,
				primary: attributes.PRIMARY
			});

			// perform callback
			//
			if (options && options.success) {
				options.success(self);
			}
		});
	}
}, {

	//
	// static attributes
	//

	extension: 'spct',
	path: config.apps.spectrum_editor.spectra_directory,

	//
	// static methods
	//

	parse: function(name) {
		if (!name) {
			return;
		}

		if (name.includes('/')) {
			return new this.prototype.constructor({
				name: name.substring(name.lastIndexOf("/") + 1, name.length),
				catalog: name.substring(0, name.lastIndexOf("/"))
			})
		} else {
			return new this.prototype.constructor({
				name: name,
				catalog: undefined
			});
		}
	},

	parseYaml: function(text, options) {
		let self = this;
		Yaml.loadAll(text, (attributes) => {
			let wavelengths = new self.prototype.constructor({
				description: attributes.DESCRIPTION,
				wavelengths: Units.arrayToUnits(attributes.WAVELENGTHS, 'nm'),
				weights: attributes.WEIGHTS,
				primary: attributes.PRIMARY
			});

			// perform callback
			//
			if (options && options.success) {
				options.success(wavelengths);
			}
		});
	}
});