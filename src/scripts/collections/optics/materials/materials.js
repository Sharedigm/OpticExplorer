/******************************************************************************\
|                                                                              |
|                                  materials.js                                |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a base type for a collection of materials.          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Material from '../../../models/optics/materials/material.js';
import BaseCollection from '../../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Material,

	//
	// querying methods
	//

	named: function(name) {
		return this.where({
			name: name
		})[0];
	},

	hasMaterial: function(material) {
		/*
		if (material && material.has('catalog')) {
			return this.contains(material);
		} else {

			// look for material with matching characteristics
			//
			for (let i = 0; i < this.length; i++) {
				let model = this.at(i);
				if (model.matches(material)) {
					return true;
				}
			}
			return false;
		}
		*/

		// look for material with matching characteristics
		//
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.matches(material)) {
				return true;
			}
		}
		return false;
	},

	toObjects: function() {
		let materials = [];
		for (let i = 0; i < this.length; i++) {
			let material = this.at(i);
			materials.push({
				name: material.get('name'),
				catalog: material.get('catalog'),
				n: material.get('index_of_refraction'),
				v: material.get('abbe_number')
			})
		}
		return materials;
	},

	//
	// loading methods
	//

	load: function(options) {
		let count = 0;
		for (let i = 0; i < this.length; i++) {
			let material = this.at(i);
			if (!material.isLoaded()) {
				material.load({

					// callbacks
					//
					success: () => {
						count++;
						if (count == this.length) {

							// perform callback
							//
							if (options && options.success) {
								options.success();
							}
						}
					}
				});
			} else {
				count++;
				if (count == this.length) {

					// perform callback
					//
					if (options && options.success) {
						options.success();
					}
				}
			}
		}
	}
}, {

	//
	// parsing methods
	//

	parse: function(objects) {
		let materials = [];

		if (objects) {
			for (let i = 0; i < objects.length; i++) {
				materials.push(Material.parse(objects[i]));
			}
		}

		return new this.prototype.constructor(materials);
	}
});