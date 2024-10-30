/******************************************************************************\
|                                                                              |
|                              distant-object.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is the definition of a light emitting object in the scene.       |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2023, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import BaseObject from '../../../models/optics/objects/base-object.js';
import Vector2 from '../../../utilities/math/vector2.js';
import Ray2 from '../../../utilities/math/ray2.js';
import Units from '../../../utilities/math/units.js';

export default BaseObject.extend({

	//
	// querying methods
	//

	hasChanged: function(attribute) {
		if (attribute == 'location') {

			// check location
			//
			return this.hasChanged('distance') || this.hasChanged('angle');
		} else if (attribute == 'direction') {

			// check direction
			//
			return this.hasChanged('angle');
		} else {

			// call superclass method
			//
			return BaseObject.prototype.hasChanged.call(this, attribute); 			
		}
	},

	//
	// getting methods
	//

	get: function(attribute) {
		if (attribute == 'location') {

			// compute location
			//
			let distance = this.has('distance')? this.get('distance').in('mm') : 0;
			let angle = this.has('angle')? this.get('angle').in('deg') : 0;	
			return new Vector2(-distance, 0).rotatedBy(angle);
		} else if (attribute == 'direction') {

			// compute direction
			//
			let distance = this.has('distance')? this.get('distance').in('mm') : 0;
			let angle = this.has('angle')? this.get('angle').in('deg') : 0;
			return new Vector2(-distance, 0).rotatedBy(angle);
		} else {

			// call superclass method
			//
			return BaseObject.prototype.get.call(this, attribute); 
		}
	},

	getRays: function(direction, points) {
		let location = this.get('location');
		let rays = [];

		// create rays from light to points
		//
		for (let i = 0; i < points.length; i++) {
			let vector = points[i].minus(location);
			let parallel = vector.parallel(direction);
			let perpendicular = vector.minus(parallel);
			rays[i] = new Ray2(location.plus(perpendicular), parallel.normalized());
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
		let object = {
			kind: this.get('kind'),
			distance: this.get('distance').toString(),
			height: this.get('height').toString()
		};

		// add optional attributes
		//
		if (this.has('angle')) {
			object.angle = this.get('angle').toString();
		}
		if (this.has('color')) {
			object.color = '"' + this.get('color') + '"';
		}

		return object;
	}
}, {

	//
	// static methods
	//

	parse: function(object) {
		return new this.prototype.constructor({
			kind: object.kind,
			distance: Units.parse(object.distance), 
			height: Units.parse(object.height), 
			angle: Units.parse(object.angle),
			color: object.color
		});
	}
});