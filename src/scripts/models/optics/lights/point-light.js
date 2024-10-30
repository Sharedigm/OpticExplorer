/******************************************************************************\
|                                                                              |
|                                  point-light.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a positional (point) light source.          |
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
		'number_of_rays': 100,
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

	getRays: function(points) {
		let rays = [];

		// create rays from light to points
		//
		let location = this.get('location');
		if (points) {
			for (let i = 0; i < points.length; i++) {
				let direction = points[i].minus(location).normalized();
				rays[i] = new Ray2(location, direction);
			}
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
			type: 'point',
			distance: this.get('distance').toString()
		};

		// add optional attributes
		//
		if (this.has('offset')) {
			object.offset = this.get('offset').toString();
		}

		// add light attributes
		//
		return Light.prototype.toObject.call(this, object);
	}
}, {

	//
	// static methods
	//

	parse: function(attributes) {
		return new this.prototype.constructor({

			// geometry
			//
			distance: Units.parse(attributes.distance), 
			offset: Units.parse(attributes.offset),

			// ray tracing
			//
			number_of_rays: attributes.number_of_rays,
			color: attributes.color,
			spectrum: Spectrum.parse(attributes.spectrum)
		});
	}
});