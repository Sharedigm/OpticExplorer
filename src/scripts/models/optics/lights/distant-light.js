/******************************************************************************\
|                                                                              |
|                               distant-light.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a directional (infinite) light source.      |
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
				return this.hasChanged('distance') || this.hasChanged('angle');
			case 'direction':
				return this.hasChanged('angle');
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
				let angle = this.has('angle')? this.get('angle').in('deg') : 0;	
				return new Vector2(-distance, 0).rotatedBy(angle);
			}
			case 'direction': {
				let distance = this.has('distance')? this.get('distance').in('mm') : 0;
				let angle = this.has('angle')? this.get('angle').in('deg') : 0;
				return new Vector2(-distance, 0).rotatedBy(angle);
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
		if (points) {
			let location = this.get('location');
			let direction = this.get('direction');
			for (let i = 0; i < points.length; i++) {
				let vector = points[i].minus(location);
				let parallel = vector.parallel(direction);
				let perpendicular = vector.minus(parallel);
				rays[i] = new Ray2(location.plus(perpendicular), parallel.normalized());
			}
		}

		return rays;
	},

	//
	// setting methods
	//

	moveTo: function(location) {
		let degrees = Math.atan2(-location.y, -location.x) * 180 / Math.PI;
		let distance = new Units(location.length(), 'mm');
		let angle = new Units(degrees, 'deg');

		// update model
		//
		this.set({
			distance: distance.like(this.get('distance')),
			angle: angle.like(this.get('angle'))
		})
	},

	//
	// converting methods
	//

	toObject: function() {

		// create object
		//
		let object = {
			type: 'distant',
			distance: this.get('distance').toString()	
		};

		// add optional attributes
		//
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

	parse: function(attributes) {
		return new this.prototype.constructor({

			// geometry
			//
			distance: Units.parse(attributes.distance), 
			angle: Units.parse(attributes.angle),

			// ray tracing
			//
			number_of_rays: attributes.number_of_rays,
			color: attributes.color,
			spectrum: Spectrum.parse(attributes.spectrum)
		});
	}
});