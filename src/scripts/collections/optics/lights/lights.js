/******************************************************************************\
|                                                                              |
|                                    lights.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of lights.                             |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseCollection from '../../../collections/base-collection.js';
import Light from '../../../models/optics/lights/light.js';
import PointLight from '../../../models/optics/lights/point-light.js';
import DistantLight from '../../../models/optics/lights/distant-light.js';
import LightBeam from '../../../models/optics/lights/light-beam.js';
import LightRay from '../../../models/optics/lights/light-ray.js';

export default BaseCollection.extend({

	//
	// attributes
	//

	model: Light,

	//
	// querying methods
	//

	isLoaded: function() {
		for (let i = 0; i < this.length; i++) {
			let light = this.at(i);
			if (light.has('spectrum')) {
				let spectrum = light.get('spectrum');
				if (spectrum.isLoaded && !spectrum.isLoaded()) {
					return false;
				}
			}
		}
		return true;
	},

	//
	// loading methods
	//

	loadSpectra: function(options) {
		let count = 0;

		if (this.isLoaded()) {

			// perform callback
			//
			if (options && options.success) {
				options.success();
			}
			return;
		}

		for (let i = 0; i < this.length; i++) {
			let light = this.at(i);

			// load light's spectrum
			//
			let spectrum = light.get('spectrum');
			if (spectrum && !spectrum.isLoaded()) {
				count++;
				spectrum.load({

					// callbacks
					//
					success: (model) => {

						// check if finished
						//
						count--;
						if (count == 0) {

							// perform callback
							//
							if (options && options.success) {
								options.success(model);
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
	}
}, {

	//
	// static methods
	//

	parseLight: function(object) {
		switch (object.type) {
			case 'point':
				return PointLight.parse(object);
			case 'distant':
				return DistantLight.parse(object);
			case 'beam':
				return LightBeam.parse(object);
			case 'ray':
				return LightRay.parse(object);
		}
	},

	parse: function(objects) {
		let lights = [];
		if (objects) {
			for (let i = 0; i < objects.length; i++) {
				lights.push(this.parseLight(objects[i]));
			}
		}
		return new this.prototype.constructor(lights);
	},
});