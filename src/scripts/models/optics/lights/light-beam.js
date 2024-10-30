/******************************************************************************\
|                                                                              |
|                                light-beam.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a light beam light source.                  |
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
		'number_of_rays': 10,
		'on': true
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
		let width = this.get('width').in('mm');
		let numberOfRays = this.get('number_of_rays');
		let direction = new Vector2(1, 0).rotatedBy(angle);
		let perpendicular = new Vector2(-direction.y, direction.x);
		
		let rays = [];
		for (let i = 0; i < numberOfRays; i++) {
			let t = (i / (numberOfRays - 1)) - 0.5;
			let offset = perpendicular.scaledBy(width * t);
			rays.push(new Ray2(location.plus(offset), direction));
		}
		return rays;
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
			type: 'beam',
			distance: this.get('distance').toString(),
			width: this.get('width').toString()
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
			width: Units.parse(object.width),

			// ray tracing
			//
			number_of_rays: object.number_of_rays,
			color: object.color,
			spectrum: Spectrum.parse(object.spectrum)
		});
	}
});