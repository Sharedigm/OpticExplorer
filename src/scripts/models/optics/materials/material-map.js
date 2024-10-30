/******************************************************************************\
|                                                                              |
|                               material-map.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a collection of materials.                  |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseModel from '../../../models/base-model.js';
import Materials from '../../../collections/optics/materials/materials.js';
import Elements from '../../../collections/optics/elements/elements.js';
import Yaml from '../../../../library/js-yaml/js-yaml.js';

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
			this.materials = attributes.materials;
		}

		// create default attributes
		//
		if (!this.materials) {
			this.materials = new Materials();
		}
	},

	//
	// querying methods
	//

	minAbbeNumber: function() {
		return this.getAbbeNumbers().min();
	},

	maxAbbeNumber: function() {
		return this.getAbbeNumbers().max();
	},

	//
	// counting methods
	//

	numMaterials: function() {
		return this.has('materials')? this.get('materials').length : 0;
	},

	//
	// getting methods
	//

	getValue: function(key) {
		switch (key) {
			case 'min_abbe':
				return this.getAbbeNumbers().min();
			case 'max_abbe':
				return this.getAbbeNumbers().max();
			case 'min_index':
				return this.getIndices().min();
			case 'max_index':
				return this.getIndices().max();
			case 'abbe_numbers':
				return this.getAbbeNumbers();
			case 'indices':
				return this.getIndices();
			default:
				return BaseModel.prototype.getValue.call(this, key);
		}
	},

	getAbbeNumbers: function() {
		let abbeNumbers = [];
		let materials = this.get('materials');
		if (materials) {
			for (let i = 0; i < materials.length; i++) {
				let material = materials.at(i);
				abbeNumbers.push(material.get('abbe_number'));
			}
		}
		return abbeNumbers;
	},

	getIndices: function() {
		let indices = [];
		let materials = this.get('materials');
		if (materials) {
			for (let i = 0; i < materials.length; i++) {
				let material = materials.at(i);
				indices.push(material.get('index_of_refraction'));
			}
		}
		return indices;
	},

	//
	// converting methods
	//

	toObject: function() {
		return {
			materials: this.materials.toObject(),
		};
	}
}, {

	//
	// parsing methods
	//

	parseYaml: function(name, text, options) {
		let self = this;
		Yaml.loadAll(text, (object) => {
			let materials = null;
			let elements = null;

			// add materials
			//
			materials = Materials.parse(object.MATERIALS);

			// add elements
			//
			elements = Elements.parse(object.ELEMENTS);

			// load element materials
			//
			elements.loadMaterials({

				// callbacks
				//
				success: () => {
					if (options && options.success) {
						options.success(new self.prototype.constructor({
							name: name,
							materials: materials,
							elements: elements
						}));
					}
				}
			});
		});
	}
});