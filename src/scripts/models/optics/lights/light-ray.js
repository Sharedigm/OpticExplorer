/******************************************************************************\
|                                                                              |
|                                 light-ray.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a light ray light source.                   |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import Light from '../../../models/optics/lights/light.js';
import Spectrum from '../../../models/optics/lights/spectrum.js';
import Units from '../../../utilities/math/units.js';
import Vector2 from '../../../utilities/math/vector2.js';
import Ray2 from '../../../utilities/math/ray2.js';

export default Light.extend({

	//
	// attributes
	//

	defaults: {
		'on': true,
		'color': '#ff0000'
	},

	//
	// querying methods
	//

	hasChanged: function(attribute) {
		switch (attribute) {
			case 'location':
				return this.hasChanged('distance') || this.hasChanged('offset');
			default:

				// call superclass method
				//
				return Light.prototype.hasChanged.call(this, attribute);
		}
	},

	//
	// getting methods
	//

	get: function(attribute) {
		switch (attribute) {
			case 'location': {
				let distance = this.has('distance')? this.get('distance').in('mm') : 0;
				let offset = this.has('offset')? this.get('offset').in('mm') : 0;
				return new Vector2(-distance, -offset);
			}
			default:

				// call superclass method
				//
				return Light.prototype.get.call(this, attribute); 
		}
	},

	getRays: function() {
		let location = this.get('location');
		let angle = this.has('angle')? this.get('angle').in('deg') : 0;
		let direction = new Vector2(1, 0).rotatedBy(angle);
		return [new Ray2(location, direction)];
	},

	//
	// setting methods
	//

	moveTo: function(location) {
		let distance = new Units(-location.x, 'mm');
		let offset = new Units(-location.y, 'mm');

		// update model
		//
		this.set({
			distance: distance.like(this.get('distance')),
			offset: offset.like(this.get('offset'))
		})
	},

	//
	// converting methods
	//

	toObject: function() {

		// create object
		//
		let object = {
			type: 'ray',
			distance: this.get('distance').toString()
		};

		// add optional attributes
		//
		if (this.has('offset')) {
			object.offset = this.get('offset').toString();
		}
		if (this.has('angle')) {
			object.angle = this.get('angle').toString();
		}

		// add light attributes
		//
		return Light.prototype.toObject.call(this, object);
	}
}, {

	//
	// static methods
	//

	parse: function(object) {
		return new this.prototype.constructor({

			// geometry
			//
			distance: Units.parse(object.distance), 
			offset: Units.parse(object.offset),
			angle: Units.parse(object.angle),

			// ray tracing
			//
			color: object.color,
			spectrum: Spectrum.parse(object.spectrum)
		});
	}
});